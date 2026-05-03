import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* rate limit memory */
const rateMap = new Map();

function rateLimit(ip) {

  const now = Date.now();
  const windowMs = 60000;
  const limit = 10;

  if (!rateMap.has(ip)) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }

  const data = rateMap.get(ip);

  if (now - data.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }

  if (data.count >= limit) {
    return false;
  }

  data.count++;
  return true;
}

/* random code */

function randomCode() {
  return Math.random().toString(36).substring(2, 7);
}

function getOrigin(req) {
  if (req.headers.origin) {
    return req.headers.origin;
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers.host}`;
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";

  if (!rateLimit(ip)) {
    return res.status(429).json({
      error: "Too many requests"
    });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "URL required"
    });
  }

  /* validate url */

  let validUrl;

  try {
    validUrl = new URL(url);
  } catch {
    return res.status(400).json({
      error: "Invalid URL"
    });
  }

  if (!["http:", "https:"].includes(validUrl.protocol)) {
    return res.status(400).json({
      error: "Invalid URL"
    });
  }

  const expire = new Date();
  expire.setDate(expire.getDate() + 7);

  let code;
  let insertError;

  for (let attempt = 0; attempt < 5; attempt++) {
    code = randomCode();

    const { error } = await supabase
      .from("short_links")
      .insert({
        original_url: validUrl.href,
        short_code: code,
        expires_at: expire
      });

    if (!error) {
      insertError = null;
      break;
    }

    insertError = error;

    if (error.code !== "23505") {
      break;
    }
  }

  if (insertError) {
    console.error("short link insert failed", insertError);

    return res.status(500).json({
      error: "Unable to create short link"
    });
  }

  res.setHeader("X-Robots-Tag", "noindex");

  res.json({
    shortUrl: `${getOrigin(req)}/${code}`
  });

}

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

  const code = randomCode();

  const expire = new Date();
  expire.setDate(expire.getDate() + 7);

  await supabase
    .from("short_links")
    .insert({
      original_url: validUrl.href,
      short_code: code,
      expires_at: expire
    });

  res.setHeader("X-Robots-Tag", "noindex");

  res.json({
    shortUrl: `${req.headers.origin}/${code}`
  });

}
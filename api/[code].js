import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  const { code } = req.query;

  if (!code) {
    return res.status(400).send("invalid code");
  }

  const { data, error } = await supabase
    .from("short_links")
    .select("*")
    .eq("short_code", code)
    .single();

  if (error || !data) {
    return res.status(404).send("not found");
  }

  /* expire check */

  if (data.expires_at && new Date() > new Date(data.expires_at)) {
    return res.status(410).send("link expired");
  }

  /* update click count (async ไม่ต้องรอ) */

  supabase
    .from("short_links")
    .update({ clicks: (data.clicks || 0) + 1 })
    .eq("id", data.id);

  /* security headers */

  res.setHeader("X-Robots-Tag", "noindex");
  res.setHeader("Referrer-Policy", "no-referrer");

  /* redirect + CDN cache */

  return res.writeHead(302, {
    Location: data.original_url,
    "Cache-Control": "public, s-maxage=31536000"
  }).end();

}
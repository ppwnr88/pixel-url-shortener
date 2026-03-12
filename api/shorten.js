import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function randomCode() {
  return Math.random().toString(36).substring(2,7);
}

export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).end();
  }

  const {url} = req.body;

  const code = randomCode();

  const expire = new Date();
  expire.setDate(expire.getDate()+7);

  await supabase
  .from("short_links")
  .insert({
    original_url:url,
    short_code:code,
    expires_at:expire
  });

  res.json({
    shortUrl:`${req.headers.origin}/${code}`
  });

}
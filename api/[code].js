import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req,res){

  const {code} = req.query;

  const {data} = await supabase
  .from("short_links")
  .select("*")
  .eq("short_code",code)
  .single();

  if(!data){
    return res.status(404).send("not found");
  }

  if(new Date() > new Date(data.expires_at)){
    return res.status(410).send("link expired");
  }

  res.redirect(data.original_url);

}
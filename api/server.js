const express = require("express");
const db = require("./db");
const redis = require("./redis");
const encode = require("./base62");

const app = express();
app.use(express.json());

const PORT = 888;

/* create short link */

app.post("/api/shorten", async (req,res)=>{

  const {url} = req.body;

  const [result] = await db.query(
    "INSERT INTO short_links(original_url) VALUES(?)",
    [url]
  );

  const id = result.insertId;

  const code = encode(id);

  await db.query(
    "UPDATE short_links SET short_code=? WHERE id=?",
    [code,id]
  );

  res.json({
    shortUrl:`http://localhost:${PORT}/${code}`
  });

});

/* redirect */

app.get("/:code", async (req,res)=>{

  const code = req.params.code;

  let url = await redis.get(code);

  if(!url){

    const [rows] = await db.query(
      "SELECT original_url FROM short_links WHERE short_code=?",
      [code]
    );

    if(!rows.length){
      return res.status(404).send("not found");
    }

    url = rows[0].original_url;

    await redis.set(code,url,{
      EX:86400
    });

  }

  res.redirect(url);

});

/* stats */

app.get("/api/stats/:code", async (req,res)=>{

  const code = req.params.code;

  const [rows] = await db.query(
    "SELECT click_count,created_at FROM short_links WHERE short_code=?",
    [code]
  );

  res.json(rows[0]);

});

app.use(express.static("public"));

app.listen(PORT,()=>{
  console.log(`API running on port ${PORT}`);
});
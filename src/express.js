// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("./DB/db.db", sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});
function getAllPromise(query, params) {
  return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
          if(err) {
            console.log(err);
          }
          // "return" the result when the action finish
          resolve(rows);
      })
  })
}
function getRunPromise(query) {
  return new Promise((resolve, reject) => {
      db.run(query, (err) => {
          if(err) {
            console.log(err);
          }
          // "return" the result when the action finish
          resolve("Done");
      })
  })
}
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.post('/restart', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let sql = `DROP TABLE Chess`;
  let x = await getRunPromise(sql);
  sql = `CREATE TABLE Chess AS SELECT * FROM IntialPosition`;
  x = await getRunPromise(sql);
  sql = `DROP TABLE Turns`;
  x = await getRunPromise(sql);
  sql = `CREATE TABLE Turns(Turn INTEGER PRIMARY KEY,Log TEXT)`;
  x = await getRunPromise(sql);
  res.send(x);
  sql = `INSERT INTO Turns VALUES(?,?)`
  x = await getAllPromise(sql,[1,"Sourav"]);
});

app.post('/chess', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let sql = `SELECT * FROM Chess WHERE Element!= ?`;
  let x = await getAllPromise(sql,"null");
  res.send(x);
});

app.post('/turn', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let sql = `SELECT MAX(Turn) AS x FROM Turns WHERE Turn!= ?`;
  let x = await getAllPromise(sql,"null");
  res.send(x);
});
app.get('/push',async(req,res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.query.ix != undefined && req.query.iy != undefined && req.query.fx != undefined && req.query.fy != undefined){
    let ix = req.query.ix;
    let iy = req.query.iy;
    let fx = req.query.fx;
    let fy = req.query.fy;
    sql = `UPDATE Chess SET PositionX = ?, PositionY = ? WHERE PositionX = ? AND PositionY= ?`
    let ans = await getAllPromise(sql,[fx,fy,ix,iy]);
  }
  res.send("DONE");
});

app.get('/turns',async(req,res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.query.turn != undefined && req.query.log != undefined){
    let turn = req.query.turn;
    let log = req.query.log;
    sql = `INSERT INTO Turns VALUES(?,?)`
    let ans = await getAllPromise(sql,[turn,log]);
  }
  res.send("DONE");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
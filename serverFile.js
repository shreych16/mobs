let express = require("express");
let app = express();
const cors = require("cors");
app.use(express.json());
// app.use(cors)
app.options("*", cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow_Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept "
  );
  next();
});

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client } = require("pg");
const connData = new Client({
  user: "postgres",
  password: "S9301122206y$",
  database: "postgres",
  port: 5432,
  host: "db.nzqyiqncszehgwqcioqv.supabase.co",
  ssl: { rejectUnauthorized: false },
});
connData.connect(function (res, error) {
  console.log(`Connected!!!`);
});

app.get("/mobs", function (req, res, next) {
    console.log("Inside /mobs get api");
    const query = "select * from mobs";
    let brand = req.query.brand;
    let ram = req.query.ram;
    let rom = req.query.rom;
    let os = req.query.os;
  
    connData.query(query, function (err, result) {
      // console.log(arr1);
      if (err) res.status(404).send(err);
      else {
          result.rows = filterParam(result.rows, "brand", brand);
          result.rows = filterParam(result.rows, "ram", ram);
          result.rows = filterParam(result.rows, "rom", rom);
        if (os) {
            result.rows = result.rows.filter((st) => st.os === os);
        }
  
        res.send(result.rows);
      }
      //connData.end();
    });
  });

  app.post("/mobs", function (req, res, next) {
    console.log("Inside post of mobs");
    var values = Object.values(req.body);
    console.log(values);
    let sql = `insert into mobs(name,price,brand,ram,rom,os) values($1,$2,$3,$4,$5,$6)`;
    connData.query(sql, values, function (err, result) {
      console.log(result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} insection successful`);
    //   connData.end();
    });
  });

  app.put("/mobs/:id", function (req, res, next) {
    console.log("Inside put of mobs");
    let id = +req.params.id;
    let name = req.body.name;
    let brand = req.body.brand;
    let price = +req.body.price;
    let ram = req.body.ram;
    let rom = req.body.rom;
    let os = req.body.os;
    let values = [name, brand, price, ram, rom, os,id];
    let sql = `update mobs set name=$1,brand=$2,price=$3,ram=$4,rom=$5,os=$6 where id=$7`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} updation successful`);
    });
  });

  app.delete("/mobs/:id", function (req, res, next) {
    console.log("Inside delete of mobs");
    let id = +req.params.id;
    let values = [id];
    let sql = `delete from emps where id=$1`;
    console.log(id);
    connData.query(sql, values, function (err, result) {
      console.log(sql, result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} delete successful`);
    });
  });

  app.get("/mobs/:id", function (req, res, next) {
    console.log("Inside /mobs/:id get api");
    let id = +req.params.id;
    let values = [id];
    let sql = `select * from mobs where id=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  let filterParam = (arr, name, values) => {
    if (!values) return arr;
    let valuesArr = values.split(",");
    let arr1 = arr.filter((a1) => valuesArr.find((val) => val === a1[name]));
    return arr1;
  };
import dotenv from "dotenv";
dotenv.config({ silent: true });

import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.ELEPHANT_SQL_USER,
  password: process.env.ELEPHANT_SQL_PW,
  host: process.env.ELEPHANT_SQL_HOST,
  database: process.env.ELEPHANT_SQL_DB,
  port: process.env.ELEPHANT_SQL_PORT,
});

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM users;")
    .then((data) => res.json(data))
    .catch((e) => res.sendStatus(500));
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE id=$1", [id])
    .then((result) => res.json(result.rows))
    .then((err) => console.log(err));
});

app.get("/ghabits", (req, res) => {
  pool
    .query("SELECT * FROM ghabits ;")
    .then((result) => res.json(result.rows))
    .then((err) => console.log(err));
});
app.get("/ghabits/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM ghabits WHERE id=$1", [id])
    .then((result) => res.json(result.rows))
    .then((err) => console.log(err));
});

app.get("/bhabits", (req, res) => {
  pool
    .query("SELECT * FROM bhabits ;")
    .then((result) => res.json(result.rows))
    .then((err) => console.log(err));
});
app.get("/bhabits/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM ghabits WHERE id=$1", [id])
    .then((result) => res.json(result.rows))
    .then((err) => console.log(err));
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await pool.query("select * from users where email=$1", [
    email,
  ]);
  if (foundUser.rows[0] != undefined) {
    res.send(foundUser.rows[0]);
  } else {
    res.send({ error: "user not found or password incorrect" });
  }
});
app.post("/users/registration", async (req, res) => {
  const { email, password } = req.body;
  const insertUser = await pool.query(
    "insert into users (email, password) values ($1, $2)",
    [email, password]
  );
  const foundUser = await pool.query("select * from users where email=$1", [
    email,
  ]);
  if (!insertUser) {
    res.send({ error: "ging nich" });
  } else {
    if (foundUser.rows[0] != undefined) {
      res.send(foundUser.rows[0]);
    } else {
      res.send({ error: "user not found or password incorrect" });
    }
  }
});
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  pool
    .query(
      "update users set email=$1, password=$2, id=$3 where id=$3 returning *;",
      [email, password, id]
    )
    .then((data) => res.status(201).json(data))
    .catch((e) => res.sendStatus(404));
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("delete from users where id=$1;", [id])
    .then((data) => res.status(201).json(data))
    .catch((e) => console.log(e));
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

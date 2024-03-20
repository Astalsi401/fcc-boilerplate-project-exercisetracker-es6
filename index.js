import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { addExercise, addUser, getLogs, getUsers } from "./app.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/index.html`);
});

app.post("/api/users", async (req, res, next) => {
  try {
    const { username } = req.body;
    const data = await addUser(username);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const data = await getUsers();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.post("/api/users/:_id/exercises", async (req, res, next) => {
  try {
    const { description, duration, date } = req.body;
    const { _id } = req.params;
    const data = await addExercise(_id, description, duration, date);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const data = await getLogs(_id, req.query.from, req.query.to, req.query.limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

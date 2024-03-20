import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: { type: String, format: "ddd MMM DD YYYY" },
});
const userSchema = new Schema({
  user_id: String,
  username: String,
});
const logSchema = new Schema({
  user_id: String,
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: { type: String, format: "ddd MMM DD YYYY" },
    },
  ],
});
const Exercise = mongoose.model("Exercise", exerciseSchema);
const User = mongoose.model("User", userSchema);
const Log = mongoose.model("Log", logSchema);
const dateFormat = /\d{4}-\d{2}-\d{2}/;

export const addUser = async (new_username) => {
  try {
    const { username, _id } = await User.create({ username: new_username });
    return { username, _id };
  } catch (err) {
    throw err;
  }
};
export const getUsers = async () => {
  try {
    const { username, _id } = await User.find({});
    return { username, _id };
  } catch (err) {
    throw err;
  }
};
export const addExercise = async (id_, description, duration, date) => {
  try {
    const { username, _id } = await User.findById(id_);
    const data = await Exercise.create({
      user_id: _id,
      username,
      description,
      duration,
      date: (dateFormat.test(date) ? new Date(date) : new Date()).toDateString(),
    });
    const userLog = await Log.find({ user_id: _id });
    if (userLog.length === 0) {
      Log.create({ user_id: _id, username, count: 1, log: [{ description, duration, date: data.date }] });
    } else {
      await Log.findOneAndUpdate({ user_id: _id }, { count: userLog[0].count + 1, $push: { log: { description, duration, date: data.date } } });
    }
    return { username, description, duration, date: data.date };
  } catch (err) {
    throw err;
  }
};

export const getLogs = async (id_, from, to, limit) => {
  try {
    const { count, log } = await Log.findOne({ user_id: id_ });
    from = dateFormat.test(from) ? new Date(from) : new Date(0);
    to = dateFormat.test(to) ? new Date(to) : new Date();
    return { count, log: log.filter((entry) => new Date(entry.date) >= from && new Date(entry.date) <= to).slice(0, limit) };
  } catch (err) {
    throw err;
  }
};

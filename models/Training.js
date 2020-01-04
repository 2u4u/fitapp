const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  maraphon: {
    type: Schema.Types.ObjectId,
    ref: "maraphon"
  },
  name: {
    type: String,
    required: true
  },
  show_name: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Training = mongoose.model("training", TrainingSchema);

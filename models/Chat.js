const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  members: {
    type: Array,
    required: true
  },
  handle: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = Chat = mongoose.model("chat", ChatSchema);

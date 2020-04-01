const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "chat"
  },
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "default",
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model("message", MessageSchema);

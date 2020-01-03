const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaraphonSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  programm: {
    type: String,
  },
  category: {
    type: String,
    required: true
  },
  goals: [
    {
      goal: {
        type: String,
        required: true
      }
    }
  ],
  start_date: {
    type: Date,
    required: true
  },
  price: {
    type: String
  },
  free: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Maraphon = mongoose.model("maraphon", MaraphonSchema);

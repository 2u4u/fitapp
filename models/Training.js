const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  marathon: {
    type: Schema.Types.ObjectId,
    ref: "marathon"
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
  tasks: [
    {
      text: {
        type: String,
      },
      type: {
        type: String,
      },
      approval: {
        type: String,
      },
    }
  ],
  status: {
    type: String,
    required: true,
    default: "default",
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

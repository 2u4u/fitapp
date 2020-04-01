const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlowSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  marathon: {
    type: Schema.Types.ObjectId,
    ref: "marathon"
  },
  marathon_name: {
    type: String,
  },
  handle: {
    type: String,
    // required: true
  },
  name: {
    type: String,
    // required: true
  },
  duration: {
    type: String,
    // required: true
  },
  start_date: {
    type: Date,
    // required: true
  },
  start_time: {
    type: Date,
    // required: true
  },
  price: {
    type: String
  },
  free: {
    type: Boolean,
    required: true,
  },
  questionary: [
    {
      question: {
        type: String
      },
      type: {
        type: String
      },
      options: {
        type: Array
      }
    }
  ],
  trainings: [
    {
      training_id: {
        type: String
      }
    }
  ],
  references: [
    {
      reference_id: {
        type: String
      }
    }
  ],
  students: [
    {
      student_id: {
        type: String
      }
    }
  ],
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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Flow = mongoose.model("flow", FlowSchema);

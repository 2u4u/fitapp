const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    // required: true
  },
  privilege: {
    type: String,
    default: 1
  },
  local: {
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    }
  },
  facebook: {
    id: {
      type: String
    },
    token: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    token: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);

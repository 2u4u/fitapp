const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require('express-session');

// const app = express();
const port = process.env.PORT || 5000;

//db config
const db = require("./config/keys").mongoURI;

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const marathons = require("./routes/api/marathons");
const trainings = require("./routes/api/trainings");
const flows = require("./routes/api/flows");
const chats = require("./routes/api/chats");

//connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error -> ", err));

// Passport Config
require("./config/jwt")(passport);
require("./config/facebook")(passport);
require("./config/google")(passport);

// server and io in middleware/socket.js
const server = require('./middleware/socket').server;
const io = require('./middleware/socket').io;
const app = require('./middleware/socket').app;

app.use(expressSession({
  secret: require("./config/keys").session.secret,
  name: require("./config/keys").session.name,
  resave: false,
  saveUninitialized: true,
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/marathons", marathons);
app.use("/api/trainings", trainings);
app.use("/api/flows", flows);
app.use("/api/chats", chats);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    console.log("we are here 2", __dirname);
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () => {
  console.log('server running at ' + port)
})
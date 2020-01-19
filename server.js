const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const https = require('https');
const http = require('http');
const fs = require('fs');
const passport = require("passport");
const expressSession = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

//body parser middleware, this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db config
const db = require("./config/keys").mongoURI;

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const marathons = require("./routes/api/marathons");
const trainings = require("./routes/api/trainings");

//connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error -> ", err));

// Passport Config
require("./config/jwt")(passport);
require("./config/facebook")(passport);
require("./config/google")(passport);

app.use(expressSession({
  secret: require("./config/keys").session.secret,
  name: require("./config/keys").session.name,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/marathons", marathons);
app.use("/api/trainings", trainings);

//to use https with ssl
const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
  http.createServer(app)
    .listen(port, () => {
      console.log('production server running at ' + port)
    })
} else {
  https.createServer(httpsOptions, app)
    .listen(port, () => {
      console.log('secured server running at ' + port)
    })
}

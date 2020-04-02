const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require('https');
const fs = require('fs');
// const http = require('http');
const cors = require("cors");

//to use https with ssl
const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

const server = https.createServer(httpsOptions, app)
// const server = http.createServer(app);
const io = require('socket.io')(server);

//body parser middleware, this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

io.on('connection', (socket) => {
  console.log('User connected ' + socket.id);

  // io.to(`${socket.id}`).emit('connected');

  socket.on('disconnect', () => {
    console.log('User Disconnected ' + socket.id, socket.username);
  });

  socket.on("send message", (data) => {
    socket.username = data.userName;
    console.log("sent message: ", data)
  })

  socket.on("new user", (data) => {
    console.log("new user: ", data)
  })
});

module.exports = { io: io, app: app, server: server };

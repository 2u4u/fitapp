const io = require('socket.io-client')

export default function () {
  const socket = (process.env.NODE_ENV === "production") ?
    io.connect(`https://sooluk.herokuapp.com/`) :
    io.connect(`https://localhost:5000`);

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb)
  }

  // function message(chatroomName, msg, cb) {
  //   socket.emit('message', { chatroomName, message: msg }, cb)
  // }

  const receive_message = (callback) => {
    console.log("message received", callback);
    socket.on('new message', callback);
  }

  const send_message = (chatroomName, messageInfo, cb) => {
    console.log("message sent", chatroomName, messageInfo);
    socket.emit("send message", { chatroomName, messageInfo }, cb);
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    register,
    join,
    leave,
    send_message,
    receive_message,
    getChatrooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler
  }
}


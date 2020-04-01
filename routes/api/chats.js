const express = require("express");
const router = express.Router();
const createHandleId = require("../../utils/createHandleId");
const io = require('../../middleware/socket').io;

// Load models
const Message = require("../../models/Message");
const Chat = require("../../models/Chat");
const User = require("../../models/User");

// @route   POST api/chats/create
// @desk    Create chatroom
// @access  Public
router.post("/create", (req, res) => {
  const sortedArray = req.body.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
  let handle = createHandleId(sortedArray.toString());

  Chat.find({ members: sortedArray })
    .then(chat => {
      //if chat exists
      if (chat && chat.length > 0) {
        return res.json(chat[0]);
      } else {
        const newChat = new Chat();
        newChat.members = sortedArray;
        newChat.handle = handle;

        newChat.save()
          .then(chat => {
            return res.json(newChat);
          })
          .catch(err => console.log("newchat save err => ", err))
      }
    })
    .catch(err => {
      console.log('CHAT ERRR', err);
      // errors.books = "There are no books";
      // res.status(400).json(errors);
    })
});

// @route   GET api/chats/chat_messages/:chatId
// @desk    Get chat messages
// @access  Public
router.get("/chat_messages/:chatId", (req, res) => {
  Chat
    .findOne({ handle: req.params.chatId })
    .then(chat => {
      Message
        .find({ chat: chat.id, deleted: false })
        .populate("user", "name")
        .then((messages) => {
          return res.json(messages);
        })
        .catch((err) => {
          console.log("ошибка поиска сообщений чата", err)
        })
    })
    .catch((err) => {
      console.log("ошибка поиска чата при получении списка сообщений", err)
    })
})

// @route   GET api/chats/user_chats/:userName
// @desk    Get user chats
// @access  Public
// TODO: make it private
router.get("/user_chats/:userName", (req, res) => {
  Chat
    .aggregate([
      { $match: { members: req.params.userName } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "chat",
          as: "message"
        }
      },
      { $unwind: "$message" },
      { $sort: { "message.date": -1 } },
      {
        $group: {
          _id: "$_id",
          members: { "$first": "$members" },
          message: { "$first": "$message" },
          handle: { "$first": "$handle" }
        }
      },
      { $sort: { "message.date": -1 } },
    ])
    .then(chats => {
      return res.json(chats);
    })
    .catch((err) => {
      console.log("ошибка поиска чатов определенного пользователя", err)
    })
})

// @route   POST api/chats/read_messages
// @desk    Mark all messages in chat as read
// @access  Public
// TODO: make it private
router.post("/read_messages", (req, res) => {
  const { chatHandle } = req.body;
  Chat
    .findOne({ handle: chatHandle })
    .then(res => {
      Message
        .updateMany(
          { chat: res._id },
          { $set: { read: true } },
        )
        .then(res => {
          // io.emit("update messages");
          console.log("updated")
        })
        .catch(err => console.log("err", err));
    })
    .catch(err => {
      console.log("err", err)
    })
})

// @route   GET api/chats/chat_members/:chatId
// @desk    Get chat members
// @access  Public
router.get("/chat_members/:chatId", (req, res) => {
  Chat
    .findOne({ handle: req.params.chatId })
    .then(chat => {
      return res.json(chat.members);
    })
    .catch((err) => {
      console.log("ошибка поиска чата при получении списка участников чата", err)
    })
})


// @route   POST api/chats/send
// @desk    Send message
// @access  Public
router.post("/send", (req, res) => {
  const { handle, text, sender } = req.body;
  Chat
    .findOne({ handle })
    .then(chat => {
      var message = new Message();
      message.chat = chat.id;
      message.user = sender;
      message.text = text;
      message
        .save()
        .then((message) => {
          io.emit("new message", message);
          return res.json(message);
        })
        .catch(err => console.log("ошибка отправки сообщения", err))
    })
    .catch((err) => {
      console.log("ошибка поиска чата при отправке сообщения", err)
    })
});

module.exports = router;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Conversations from "./Conversations";
import Messages from "./Messages";
import { getAllUsers } from "../../actions/userAction";
import { startChat, sendMessage, getChatMembers, getChatMessages, getAllChats, readMessages } from "../../actions/chatAction";
import { Col, Row } from 'antd';
import styles from "./styles.module.scss";
// import socket from '../../utils/socket';

import io from "socket.io-client";
const socket = (process.env.NODE_ENV === "production") ?
  io.connect(`https://sooluk.herokuapp.com/`) :
  io.connect(`https://localhost:5000`);

function Chat() {
  const dispatch = useDispatch();
  const history = useHistory();
  const param = useParams();

  const userId = useSelector(state => state.auth.user.id);
  const usersList = useSelector(state => state.user.users);
  const userName = useSelector(state => state.auth.user.name);
  const messages = useSelector(state => state.chats.messages);
  const chats = useSelector(state => state.chats.chats);
  const members = useSelector(state => state.chats.members);
  const chatMate = members.filter(member => member !== userName);
  const chatHandle = param.chatId;
  const [state, setState] = useState({
    value: ""
  })

  //adding information about next and previous messages to group messages
  let filteredMessages = (messages.length > 0) ?
    messages.map((message, index) => {
      if (index + 1 < messages.length && message.user.name === messages[index + 1].user.name) {
        message.next = "same";
      };
      if (index - 1 >= 0 && message.user.name === messages[index - 1].user.name) {
        message.prev = "same";
      };
      return message;
    }) : [];

  const onStartConversation = (name) => {
    dispatch(startChat([name, userName], history));
  }

  const onOpenConversation = (chatHandle) => {
    console.log("onOpenConversation chatHandle", chatHandle)
    history.push(`/admin/chat/${chatHandle}`);
    dispatch(readMessages(chatHandle));
  }

  const onUpdateReadMessages = (chatHandle) => {
    // console.log("onUpdateReadMessages chatHandle", chatHandle)
    // dispatch(readMessages(chatHandle));
  }

  const onTypeMessage = (e) => {
    const { value } = e.target;
    setState(state => ({ ...state, value }));
  }

  const onSubmitMessage = (e) => {
    if (e.key === 'Enter') onSendMessage();
  }

  const onSendMessage = () => {
    socket.emit("send message", { message: state.value, userId, chat: chatHandle });
    setState(state => ({ ...state, value: "" }));
    dispatch(sendMessage({ text: state.value, sender: userId, handle: chatHandle }, chatHandle));
  }

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllChats(userName));
    if (chatHandle) {
      console.log("if")
      dispatch(getChatMessages(chatHandle));
      dispatch(getChatMembers(chatHandle));
    }
    socket.on("new message", () => {
      console.log("new message")
      dispatch(getChatMessages(chatHandle));
      dispatch(getAllChats(userName));
    })
    // socket.on("update messages", () => {
    //   console.log("update messages")
    //   dispatch(getChatMessages(chatHandle));
    //   dispatch(getAllChats(userName));
    // })
  }, [dispatch, chatHandle, userName]);

  return (
    <div className={styles.chat}>
      <Row type="flex" style={{ height: "100%" }}>
        <Col span={8} style={{ height: "100%" }}>
          <Conversations
            chats={chats}
            usersList={usersList}
            userId={userId}
            userName={userName}
            onStartConversation={name => onStartConversation(name)}
            onOpenConversation={handle => onOpenConversation(handle)}
          />
        </Col>
        <Col span={16} style={{ height: "100%" }}>
          <Messages
            chatMate={chatMate}
            messages={filteredMessages}
            userName={userName}
            chatHandle={chatHandle}
            onTypeMessage={text => onTypeMessage(text)}
            onSubmitMessage={e => onSubmitMessage(e)}
            inputValue={state.value}
            onUpdateReadMessages={handle => onUpdateReadMessages(handle)}
          />
        </Col>
      </Row>
    </div>
  )
}
export default Chat;
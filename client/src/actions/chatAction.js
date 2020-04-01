import axios from "axios";
import { GET_ERRORS, START_CHAT, GET_CHAT_MESSAGES, GET_CHAT_MEMBERS, GET_USER_CHATS } from "./types";

// Send message to chat
export const sendMessage = (messageData, chatHandle) => dispatch => {
  // dispatch({ type: LOADING, payload: true })
  axios
    .post("/api/chats/send", messageData)
    .then(res => {
      dispatch(getChatMessages(chatHandle))
    })
    .catch(err => {
      console.log("err", err)
      // dispatch({ type: LOADING, payload: false })
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data
      // })
    });
};

// Mark all messages in chat as read
export const readMessages = (chatHandle) => dispatch => {
  // dispatch({ type: LOADING, payload: true })
  console.log("readMessages onUpdateReadMessages")
  axios
    .post("/api/chats/read_messages", { chatHandle })
    .then(res => {
      console.log("messages read", res)
      // dispatch(getChatMessages(chatHandle))
    })
    .catch(err => {
      console.log("err", err)
    });
};

// Start new chat with user
export const startChat = (members, history) => dispatch => {
  axios
    .post("/api/chats/create", members)
    .then(res => {
      history.push(`/admin/chat/${res.data.handle}`);
      dispatch({
        type: START_CHAT,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

// export const openChat = 

export const getAllChats = (userName) => dispatch => {
  axios
    .get(`/api/chats/user_chats/${userName}`)
    .then(res => {
      dispatch({
        type: GET_USER_CHATS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("err", err)
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data
      // })
    });
}

export const getChatMessages = (chatId) => dispatch => {
  axios
    .get(`/api/chats/chat_messages/${chatId}`)
    .then(res => {
      dispatch({
        type: GET_CHAT_MESSAGES,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("err", err)
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data
      // })
    });
}

export const getChatMembers = (chatId) => dispatch => {
  axios
    .get(`/api/chats/chat_members/${chatId}`)
    .then(res => {
      dispatch({
        type: GET_CHAT_MEMBERS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("err", err)
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data
      // })
    });
}
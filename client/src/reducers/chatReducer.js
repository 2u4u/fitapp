import { START_CHAT, GET_CHAT_MESSAGES, GET_CHAT_MEMBERS, GET_USER_CHATS } from "../actions/types";

const initialState = {
  chat: {},
  messages: [],
  members: [],
  chats: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_CHAT:
      return {
        ...state,
        chat: action.payload
      };
    case GET_CHAT_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };
    case GET_CHAT_MEMBERS:
      return {
        ...state,
        members: action.payload
      };
    case GET_USER_CHATS:
      return {
        ...state,
        chats: action.payload
      }
    default:
      return state;
  }
}

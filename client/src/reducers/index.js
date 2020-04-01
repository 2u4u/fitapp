import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import postReducer from "./postReducer";
import marathonReducer from "./marathonReducer";
import flowReducer from "./flowReducer";
import trainingReducer from "./trainingReducer";
import userReducer from "./userReducer"
import chatReducer from "./chatReducer"

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  error: errorReducer,
  post: postReducer,
  marathon: marathonReducer,
  flow: flowReducer,
  training: trainingReducer,
  chats: chatReducer
});

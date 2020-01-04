import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import postReducer from "./postReducer";
import maraphonReducer from "./maraphonReducer";
import trainingReducer from "./trainingReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  post: postReducer,
  maraphon: maraphonReducer,
  training: trainingReducer
});

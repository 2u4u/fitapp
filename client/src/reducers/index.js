import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import postReducer from "./postReducer";
import marathonReducer from "./marathonReducer";
import trainingReducer from "./trainingReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  post: postReducer,
  marathon: marathonReducer,
  training: trainingReducer
});

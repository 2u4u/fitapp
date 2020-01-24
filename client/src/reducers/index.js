import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import postReducer from "./postReducer";
import marathonReducer from "./marathonReducer";
import flowReducer from "./flowReducer";
import trainingReducer from "./trainingReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  post: postReducer,
  marathon: marathonReducer,
  flow: flowReducer,
  training: trainingReducer
});

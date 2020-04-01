import axios from "axios";
import { GET_ERRORS, GET_USERS } from "./types";

// Get list of all users
export const getAllUsers = () => dispatch => {
  axios
    .get("/api/users/all")
    .then(res => {
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};
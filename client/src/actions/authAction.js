import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_token from "jwt-decode";

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Login user
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set to LS
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("authenticated", true);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_token(token);

      dispatch(setCurrentUser(decoded));
      dispatch({
        type: GET_ERRORS,
        payload: ""
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set Loged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  axios
    .get("/api/users/logout")
    .then(res => {
      // Remove from LS
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("authenticated");
      // Remove token from Auth header
      setAuthToken(false);
      // Set current user to {} which will make isAithenticated false
      dispatch(setCurrentUser({}));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
};

// Check user status
export const checkSocialLogin = () => dispatch => {
  axios
    .get("/api/users/social", null)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set to LS
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("authenticated", true);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_token(token);

      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data
      // })
    })
}
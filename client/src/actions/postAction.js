import axios from "axios";
import { GET_ERRORS, LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_USER_POSTS, SHOW_ALL_POSTS, SHOW_DETAILED_POST } from "./types";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_token from "jwt-decode";

// Add post
export const addPost = (postData) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .post("/api/posts/add", postData)
    .then(res => {
      dispatch({ type: LOADING, payload: false })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "You have successfully added you post" } })
      dispatch({ type: LOAD_POST_TO_EDIT, payload: {} })
      setTimeout(() =>
        dispatch({ type: NOTIFICATION, payload: { active: false, type: "", text: "" } })
        , 5000);

    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Show post to edit
export const openEditPost = (id, history) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .get(`/api/posts/edit/${id}`)
    .then(res => {
      dispatch({
        type: LOAD_POST_TO_EDIT,
        payload: res.data
      })
      history.push("/edit")
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Like post
export const likePost = (postId) => dispatch => {
  axios
    .post(`/api/posts/like/${postId}`)
    .then(res => {
      console.log("hi")
      dispatch(showAllPosts())
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Remove post
export const removePost = (postId, userId) => dispatch => {
  // dispatch({ type: LOADING, payload: true })
  axios
    .delete(`/api/posts/delete/${postId}`)
    .then(res => {
      dispatch(updateUserPosts(userId));
      // dispatch({ type: LOADING, payload: false })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "danger", text: "Yout successfully removed your post" } })
      setTimeout(() =>
        dispatch({ type: NOTIFICATION, payload: { active: false, type: "", text: "" } })
        , 5000);

    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Show all post of this user
export const showUserPosts = (userId) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  dispatch(updateUserPosts(userId));
};

// Update list of all post of this user
export const updateUserPosts = (user) => dispatch => {
  axios
    .get(`/api/posts/all/${user}`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_USER_POSTS,
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

// Show all post
export const showAllPosts = () => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .get(`/api/posts/all`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_POSTS,
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

// Show post detailed
export const showDetailedPost = (user, handle) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .get(`/api/posts/detailed/${user}/${handle}`)
    .then(res => {
      dispatch({
        type: SHOW_DETAILED_POST,
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
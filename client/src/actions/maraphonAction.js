import axios from "axios";
import { GET_ERRORS, LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_USER_MARAPHONS, SHOW_ALL_POSTS, SHOW_DETAILED_MARAPHON } from "./types";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_token from "jwt-decode";

// Add maraphon
export const addMaraphon = (maraphonData) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .post("/api/maraphons/add", maraphonData)
    .then(res => {
      dispatch({ type: LOADING, payload: false })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "Марафон успешно добавлен" } })
      // dispatch({ type: LOAD_POST_TO_EDIT, payload: {} })
      setTimeout(() =>
        dispatch({ type: NOTIFICATION, payload: { active: false, type: "", text: "" } })
        , 5000);

    })
    .catch(err => {
      dispatch({ type: LOADING, payload: false })
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Show all maraphons of this user
export const showUserMaraphons = (userId) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  dispatch(updateUserMaraphons(userId));
};

// Show maraphon details
export const showDetailedMaraphon = (handle) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  console.log("showDetailedMaraphon handle", handle)
  axios
    .get(`/api/maraphons/detailed/${handle}`)
    .then(res => {
      dispatch({
        type: SHOW_DETAILED_MARAPHON,
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
      dispatch(updateUserMaraphons(userId));
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

// Update list of all post of this user
export const updateUserMaraphons = (user) => dispatch => {
  axios
    .get(`/api/maraphons/all/${user}`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_USER_MARAPHONS,
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

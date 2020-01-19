import axios from "axios";
import { GET_ERRORS, LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_USER_MARATHONS, SHOW_ALL_POSTS, SHOW_DETAILED_MARATHON } from "./types";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_token from "jwt-decode";

// Add marathon
export const addMarathon = (marathonData, handle) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .post("/api/marathons/add", marathonData)
    .then(res => {
      let successMessage = handle ? "Марафон успешно изменен" : "Марафон успешно добавлен";
      dispatch({ type: LOADING, payload: false })
      dispatch({ type: GET_ERRORS, payload: {} })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: successMessage } })
      dispatch(showUserMarathons(marathonData.user));
      if (handle) {
        dispatch(showDetailedMarathon(handle));
      }
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

// Show all marathons of this user
export const showUserMarathons = (userId) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  dispatch(updateUserMarathons(userId));
};

// Show marathon details
export const showDetailedMarathon = (handle) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .get(`/api/marathons/detailed/${handle}`)
    .then(res => {
      dispatch({
        type: SHOW_DETAILED_MARATHON,
        payload: res.data
      })
    })
    .catch(err => {
      if (err && err.response) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      } else {
        console.log("showDetailedMarathon err =>", err)
      }
    }
    );
};

// Update list of all marathons of this user
export const updateUserMarathons = (user) => dispatch => {
  axios
    .get(`/api/marathons/all/${user}`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_USER_MARATHONS,
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

export const activateMarathon = (data) => dispatch => {
  axios
    .post(`/api/marathons/changestatus`, data)
    .then(res => {
      dispatch({
        type: SHOW_DETAILED_MARATHON,
        payload: res.data
      })
    })
    .catch(err => console.log("err", err))
}

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
      dispatch(updateUserMarathons(userId));
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

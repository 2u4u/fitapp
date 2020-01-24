import axios from "axios";
import { GET_ERRORS, LOADING, NOTIFICATION, SHOW_ALL_USER_MARATHONS, SHOW_DETAILED_MARATHON } from "./types";

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
      dispatch(fillDetailedMarathon(res.data))
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

// Clear detailed mrathon data
export const fillDetailedMarathon = (data) => dispatch => {
  dispatch({
    type: SHOW_DETAILED_MARATHON,
    payload: data
  })
}

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

// change marathon status
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

// Delete marathon
export const deleteMarathon = (marathonId, userId) => dispatch => {
  dispatch({ type: LOADING, payload: true })
  axios
    .delete(`/api/marathons/delete/${marathonId}`)
    .then(res => {
      dispatch(updateUserMarathons(userId));
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "Марафон успешно удален" } })
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
import axios from "axios";
import { GET_ERRORS, TRAINING_LOADING, NOTIFICATION, SHOW_ALL_MARATHON_TRAININGS, SHOW_DETAILED_TRAINING } from "./types";

// Add training
export const addTraining = (trainingData) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  axios
    .post("/api/trainings/add", trainingData)
    .then(res => {
      dispatch({ type: TRAINING_LOADING, payload: false })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "Тренировка успешно добавлена" } })
      // dispatch({ type: LOAD_POST_TO_EDIT, payload: {} })
      dispatch(showMarathonTrainings(trainingData.marathon, trainingData.flow));
      setTimeout(() =>
        dispatch({ type: NOTIFICATION, payload: { active: false, type: "", text: "" } })
        , 5000);

    })
    .catch(err => {
      dispatch({ type: TRAINING_LOADING, payload: false })
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Show all trainings in this marathon
export const showMarathonTrainings = (marathonId, flowId) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  dispatch(updateMarathonTrainings(marathonId, flowId));
};

// Show training details
export const showDetailedTraining = (handle) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  axios
    .get(`/api/trainings/detailed/${handle}`)
    .then(res => {
      dispatch(fillDetailedTraining(res.data))
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Update list of all trainings in this marathon
export const updateMarathonTrainings = (marathon, flow) => dispatch => {
  axios
    .get(`/api/trainings/all/${marathon}/${flow}`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_MARATHON_TRAININGS,
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

// Clear detailed training data
export const fillDetailedTraining = (data) => dispatch => {
  dispatch({
    type: SHOW_DETAILED_TRAINING,
    payload: data
  })
}

// change training status
export const activateTraining = (data) => dispatch => {
  axios
    .post(`/api/trainings/changestatus`, data)
    .then(res => {
      dispatch({
        type: SHOW_DETAILED_TRAINING,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}


// Delete training
export const deleteTraining = (trainingId, flow, marathon) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  axios
    .delete(`/api/trainings/delete/${trainingId}`)
    .then(res => {
      dispatch(updateMarathonTrainings(marathon, flow));
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "Поток удален" } })
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
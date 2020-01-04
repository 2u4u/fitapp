import axios from "axios";
import { GET_ERRORS, TRAINING_LOADING, NOTIFICATION, SHOW_ALL_MARAPHON_TRAININGS, SHOW_DETAILED_TRAINING } from "./types";

// Add training
export const addTraining = (trainingData) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  axios
    .post("/api/trainings/add", trainingData)
    .then(res => {
      dispatch({ type: TRAINING_LOADING, payload: false })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "Тренировка успешно добавлена" } })
      // dispatch({ type: LOAD_POST_TO_EDIT, payload: {} })
      dispatch(showMaraphonTrainings(trainingData.maraphon));
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

// Show all trainings in this maraphon
export const showMaraphonTrainings = (maraphonId) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  dispatch(updateMaraphonTrainings(maraphonId));
};

// Show training details
export const showDetailedTraining = (handle) => dispatch => {
  dispatch({ type: TRAINING_LOADING, payload: true })
  axios
    .get(`/api/trainings/detailed/${handle}`)
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
    }
    );
};

// Update list of all trainings in this maraphon
export const updateMaraphonTrainings = (maraphon) => dispatch => {
  axios
    .get(`/api/trainings/all/${maraphon}`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_MARAPHON_TRAININGS,
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
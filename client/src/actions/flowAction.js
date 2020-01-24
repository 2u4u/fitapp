import axios from "axios";
import { GET_ERRORS, FLOW_LOADING, NOTIFICATION, SHOW_ALL_MARATHON_FLOWS, SHOW_DETAILED_FLOW } from "./types";

// Add flow
export const addFlow = (flowData) => dispatch => {
  dispatch({ type: FLOW_LOADING, payload: true })
  axios
    .post("/api/flows/add", flowData)
    .then(res => {
      dispatch({ type: FLOW_LOADING, payload: false })
      dispatch({ type: NOTIFICATION, payload: { active: true, type: "success", text: "Поток успешно добавлен" } })
      dispatch(showMarathonFlows(flowData.marathon));
      setTimeout(() =>
        dispatch({ type: NOTIFICATION, payload: { active: false, type: "", text: "" } })
        , 5000);
    })
    .catch(err => {
      dispatch({ type: FLOW_LOADING, payload: false })
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Show all flows in this marathon
export const showMarathonFlows = (marathonId) => dispatch => {
  dispatch({ type: FLOW_LOADING, payload: true })
  dispatch(updateMarathonFlows(marathonId));
};

// Show flow details
export const showDetailedFlow = (handle) => dispatch => {
  dispatch({ type: FLOW_LOADING, payload: true })
  axios
    .get(`/api/flows/detailed/${handle}`)
    .then(res => {
      dispatch(fillDetailedFlow(res.data))
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

// Update list of all flows in this marathon
export const updateMarathonFlows = (marathon) => dispatch => {
  axios
    .get(`/api/flows/all/${marathon}`)
    .then(res => {
      dispatch({
        type: SHOW_ALL_MARATHON_FLOWS,
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

// Clear detailed flow data
export const fillDetailedFlow = (data) => dispatch => {
  dispatch({
    type: SHOW_DETAILED_FLOW,
    payload: data
  })
}

// change flow status
export const activateFlow = (data) => dispatch => {
  axios
    .post(`/api/flows/changestatus`, data)
    .then(res => {
      dispatch({
        type: SHOW_DETAILED_FLOW,
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

// Delete flow
export const deleteFlow = (flowId, marathon) => dispatch => {
  dispatch({ type: FLOW_LOADING, payload: true })
  axios
    .delete(`/api/flows/delete/${flowId}`)
    .then(res => {
      dispatch(updateMarathonFlows(marathon));
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
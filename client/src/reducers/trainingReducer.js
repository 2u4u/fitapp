import { TRAINING_LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_MARAPHON_TRAININGS, SHOW_ALL_TRAININGS, SHOW_DETAILED_TRAINING } from "../actions/types";
// import _ from "lodash";

const initialState = {
  loading: false,
  all_trainings: [],
  trainings: [],
  detailed_training: {},
  training_to_edit: {},
  notification: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TRAINING_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SHOW_ALL_MARAPHON_TRAININGS:
      return {
        ...state,
        trainings: action.payload,
        loading: false
      };
    case SHOW_ALL_TRAININGS:
      return {
        ...state,
        all_trainings: action.payload,
        loading: false
      };
    case SHOW_DETAILED_TRAINING:
      return {
        ...state,
        detailed_training: action.payload,
        loading: false
      };
    case LOAD_POST_TO_EDIT:
      return {
        ...state,
        training_to_edit: action.payload
      };
    case NOTIFICATION:
      return {
        ...state,
        notification: action.payload
      }
    default:
      return state;
  }
}

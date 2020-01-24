import { FLOW_LOADING, NOTIFICATION, SHOW_ALL_MARATHON_FLOWS, SHOW_ALL_FLOWS, SHOW_DETAILED_FLOW } from "../actions/types";
// import _ from "lodash";

const initialState = {
  loading: false,
  all_flows: [],
  flows: [],
  detailed_flow: {},
  flow_to_edit: {},
  notification: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FLOW_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SHOW_ALL_MARATHON_FLOWS:
      return {
        ...state,
        flows: action.payload,
        loading: false
      };
    case SHOW_ALL_FLOWS:
      return {
        ...state,
        all_flows: action.payload,
        loading: false
      };
    case SHOW_DETAILED_FLOW:
      return {
        ...state,
        detailed_flow: action.payload,
        loading: false
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

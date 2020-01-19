import { LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_USER_MARATHONS, SHOW_ALL_POSTS, SHOW_DETAILED_MARATHON } from "../actions/types";
// import _ from "lodash";

const initialState = {
  loading: false,
  all_marathons: [],
  marathons: [],
  detailed_marathon: {},
  marathon_to_edit: {},
  notification: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SHOW_ALL_USER_MARATHONS:
      return {
        ...state,
        marathons: action.payload,
        loading: false
      };
    case SHOW_ALL_POSTS:
      return {
        ...state,
        all_marathons: action.payload,
        loading: false
      };
    case SHOW_DETAILED_MARATHON:
      return {
        ...state,
        detailed_marathon: action.payload,
        loading: false
      };
    case LOAD_POST_TO_EDIT:
      return {
        ...state,
        marathon_to_edit: action.payload
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

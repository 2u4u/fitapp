import { LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_USER_MARAPHONS, SHOW_ALL_POSTS, SHOW_DETAILED_MARAPHON } from "../actions/types";
// import _ from "lodash";

const initialState = {
  loading: false,
  all_maraphons: [],
  maraphons: [],
  detailed_maraphon: {},
  maraphon_to_edit: {},
  notification: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SHOW_ALL_USER_MARAPHONS:
      return {
        ...state,
        maraphons: action.payload,
        loading: false
      };
    case SHOW_ALL_POSTS:
      return {
        ...state,
        all_maraphons: action.payload,
        loading: false
      };
    case SHOW_DETAILED_MARAPHON:
      return {
        ...state,
        detailed_maraphon: action.payload,
        loading: false
      };
    case LOAD_POST_TO_EDIT:
      return {
        ...state,
        maraphon_to_edit: action.payload
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

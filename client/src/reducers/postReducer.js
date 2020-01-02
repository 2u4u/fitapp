// import { LOADING, NOTIFICATION, LOAD_POST_TO_EDIT, SHOW_ALL_USER_POSTS, SHOW_ALL_POSTS, SHOW_DETAILED_POST } from "../actions/types";
// // import _ from "lodash";

// const initialState = {
//   loading: false,
//   all_posts: [],
//   posts: [],
//   detailed_post: {},
//   post_to_edit: {},
//   notification: {}
// };

// export default function (state = initialState, action) {
//   switch (action.type) {
//     case LOADING:
//       return {
//         ...state,
//         loading: action.payload
//       };
//     case SHOW_ALL_USER_POSTS:
//       return {
//         ...state,
//         posts: action.payload,
//         loading: false
//       };
//     case SHOW_ALL_POSTS:
//       return {
//         ...state,
//         all_posts: action.payload,
//         loading: false
//       };
//     case SHOW_DETAILED_POST:
//       return {
//         ...state,
//         detailed_post: action.payload,
//         loading: false
//       };
//     case LOAD_POST_TO_EDIT:
//       return {
//         ...state,
//         post_to_edit: action.payload
//       };
//     case NOTIFICATION:
//       return {
//         ...state,
//         notification: action.payload
//       }
//     default:
//       return state;
//   }
// }

import UserActionTypes from "./user-action-types";

// Initial state
const INITIAL_STATE = null;

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.LOGGED_IN_USER:
      return action.payload;
    case UserActionTypes.LOGOUT:
      return action.payload;
    default:
      return state;
  }
};

export default UserReducer;

/**
 * Import Dependencies
 */
import { SET_USER } from "./constants";
import { fromJS } from "immutable";
/**
 * Set Initial State
 */
export const initialState = fromJS({
  user: {
    firstname: "",
    lastname: ""
  }
});

/**
 * Define the reducer with actions
 *
 * @param {Object} state
 * @param {Object} action
 */
function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return state.set("user", action.data);

    default:
      return state;
  }
}

/**
 * Export the reducer
 */
export default UserReducer;

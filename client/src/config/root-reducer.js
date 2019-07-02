/**
 * Import Dependencies
 */
import { combineReducers } from "redux-immutable";

/**
 * Import Reducers
 * All Reducers used in the App must be declared here!
 */
import GraphicReducer from "modules/Graphics/reducer";
import UserReducer from "modules/User/reducer";
/**
 * Combine the Reducers
 */
const reducers = combineReducers({
  graphics: GraphicReducer,
  user: UserReducer
});

/**
 * Export the combined Reducers
 */
export default reducers;

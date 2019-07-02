/**
 * Import Dependencies
 */
import { fromJS } from "immutable";
import {
  IS_FETCHING,
  SET_GRAPHICS,
  DEFAULT_PAGINATION,
  DEFAULT_FILTERS,
  SET_PAGINATION,
  SET_SEARCH_FILTER,
  SET_SORT,
  SET_SORT_ORDER
} from "./constants";

/**
 * Set Initial State
 */
export const initialState = fromJS({
  is_fetching: false,
  graphics: [],
  modal: false,
  selectedId: "",
  pagination: DEFAULT_PAGINATION,
  search: "",
  sort: DEFAULT_FILTERS.sort,
  sort_order: DEFAULT_FILTERS.sort_order
});

/**
 * Define the reducer with actions
 *
 * @param {Object} state
 * @param {Object} action
 */
function GraphicReducer(state = initialState, action) {
  switch (action.type) {
    case IS_FETCHING:
      return state.set("is_fetching", action.data);

    case SET_GRAPHICS:
      if (!action.data.length) {
        action.data = initialState.get("graphics");
      }
      return state.set("graphics", action.data);

    case SET_PAGINATION:
      if (!Object.keys(action.data).length) {
        action.data = initialState.get("pagination");
      }
      return state.set("pagination", action.data);

    case SET_SEARCH_FILTER:
      if (!action.data) {
        action.data = initialState.get("search");
      }
      return state.set("search", action.data);

    case SET_SORT:
      if (!action.data) {
        action.data = initialState.get("sort");
      }
      return state.set("sort", action.data);

    case SET_SORT_ORDER:
      if (!action.data) {
        action.data = initialState.get("sort_order");
      }
      return state.set("sort_order", action.data);

    default:
      return state;
  }
}

/**
 * Export the reducer
 */
export default GraphicReducer;

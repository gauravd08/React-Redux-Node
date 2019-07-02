/**
 * Import Dependencies
 */
import { createSelector } from "reselect";

/**
 * Select the portion of the root reducer
 */
const GraphicReducer = () => state => state.get("graphics");

/**
 * Get Fetching Status
 *
 * @return {Boolean}
 */
export const isFetching = () =>
  createSelector(
    GraphicReducer(),
    state => {
      return state.get("is_fetching");
    }
  );

/**
 * Get Posts
 *
 * @return {Array}
 */
export const getGraphics = () =>
  createSelector(
    GraphicReducer(),
    state => {
      const d = state.get("graphics");
      return !d || d.__altered == false ? d.toJS() : d;
    }
  );

/**
 * Get Pagination
 *
 * @return {Array}
 */
export const getPagination = () =>
  createSelector(
    GraphicReducer(),
    state => {
      const d = state.get("pagination");
      return !d || d.__altered == false ? d.toJS() : d;
    }
  );

/**
 * Get Sort Key
 *
 * @return {String}
 */
export const getSort = () =>
  createSelector(
    GraphicReducer(),
    state => {
      const d = state.get("sort");
      return !d || d.__altered == false ? "" : d;
    }
  );

/**
 * Get Sort Order
 *
 * @return {String}
 */
export const getSortOrder = () =>
  createSelector(
    GraphicReducer(),
    state => {
      const d = state.get("sort_order");
      return !d || d.__altered == false ? "" : d;
    }
  );

/**
 * Get Search Filter
 *
 * @return {String}
 */
export const getSearchFilter = () =>
  createSelector(
    GraphicReducer(),
    state => {
      const d = state.get("search");
      return !d || d.__altered == false ? "" : d;
    }
  );

/**
 * Import Dependencies
 */
import { GET_GRAPHICS } from "config/endpoints";
// import { httpGet } from "#utils/http";

import {
  IS_FETCHING,
  IS_REQUESTING,
  SET_GRAPHICS,
  SET_PAGINATION,
  SET_SEARCH_FILTER,
  SET_SORT,
  SET_SORT_ORDER
} from "./constants";

import { getFilters } from "./helper";

import { httpGet } from "utils/http";

// /* Used to cancel Fetch Posts Http Requests */
let cancel_fetch_graphics = [];

/**
 * Update is_fetching TRUE|FALSE in Redux Store
 *
 * @param {Boolean} is_fetching
 */
export const updateIsFetching = is_fetching => {
  return { type: IS_FETCHING, data: is_fetching };
};

/**
 * Update is_requesting TRUE|FALSE in Redux Store
 *
 * @param {Boolean} is_requesting
 */
export const updateIsRequesting = is_requesting => {
  return { type: IS_REQUESTING, data: is_requesting };
};

/**
 * Set Pagination
 *
 * @param {Object} data [Pagination Object]
 */
export const setPagination = (data = {}) => {
  return { type: SET_PAGINATION, data };
};

/**
 * Set Posts List in Redux Store
 *
 * @param {Array} data [Array of Posts]
 */
export const setGraphics = (data = []) => {
  return { type: SET_GRAPHICS, data };
};

/**
 * Set Search Filter
 *
 * @param {String} data [Status Key]
 */
export const setSearchFilter = (data = "") => {
  return { type: SET_SEARCH_FILTER, data };
};

/**
 * Set Sort
 *
 * @param {String} data [Field Key to sort]
 */
export const setSort = (data = "") => {
  return { type: SET_SORT, data };
};

/**
 * Set Sort
 *
 * @param {String} data [Sort Order]
 */
export const setSortOrder = (data = "") => {
  return { type: SET_SORT_ORDER, data };
};

/**
 * Get Campaigns List from API
 */
export const fetchGraphics = () => {
  return (dispatch, getState) => {
    dispatch(updateIsFetching(true));
    setTimeout(() => {
      try {
        cancelFetchGraphics();
        const state = getState().get("graphics");
        const filters = getFilters(state);
        let url = GET_GRAPHICS;

        url += `?offset=${filters.offset}`;
        url += `&limit=${filters.limit}`;
        url += `&sort=${filters.sort}`;
        url += `&order=${filters.order}`;
        if (filters.search) url += `&search=${filters.search}`;
        const token = localStorage.getItem("token");
        httpGet(url, { headers: { token } }).then(
          res => {
            dispatch(
              setPagination({
                offset: filters.offset,
                current: filters.current,
                limit: filters.limit,
                total: res.total
              })
            );

            dispatch(setGraphics(res.graphics));
            dispatch(updateIsFetching(false));
          },
          err => {
            if (err == "cancelled") return;
            dispatch(updateIsFetching(false));
            dispatch(setGraphics([]));
          }
        );
      } catch (e) {
        console.error("-- SS FETCH POSTS --", e);
        dispatch(updateIsFetching(false));
      }
    }, 200);
  };
};

/**
 * Cancel Fetch Posts Request
 */
export const cancelFetchGraphics = () => {
  try {
    cancel_fetch_graphics.forEach(cancel => cancel());
    cancel_fetch_graphics = [];
  } catch (e) {
    cancel_fetch_graphics = [];
  }
};

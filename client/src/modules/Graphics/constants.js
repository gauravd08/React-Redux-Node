export const IS_FETCHING = "IS_FETCHING";
export const IS_REQUESTING = "IS_REQUESTING";
export const SET_GRAPHICS = "GRAPHICS";
export const SET_PAGINATION = "SET_PAGINATION";
export const SET_SEARCH_FILTER = "SET_SEARCH_FILTER";
export const SET_SORT = "SET_SORT";
export const SET_SORT_ORDER = "SET_SORT_ORDER";

/* Default Pagination for Graphics Listing */
export const DEFAULT_PAGINATION = {
  offset: 0,
  current: 1,
  limit: 10,
  total: 0
};

/* Default Filters */
export const DEFAULT_FILTERS = {
  sort: "id",
  sort_order: "DESC",
  search: ""
};

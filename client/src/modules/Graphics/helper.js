/**
 * Get Filters
 *
 * @param {Object} state ['campaigns_list' Reducer]
 *
 * @return {Object}
 */
export const getFilters = state => {
  let page = state.get("pagination");
  if (!page.limit) page = page.toJS();

  /* Filters */
  const filters = {
    current: page.current,
    limit: page.limit,
    offset: page.offset,
    search: state.get("search"),
    sort: state.get("sort"),
    order: state.get("sort_order")
  };

  return filters;
};

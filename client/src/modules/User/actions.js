/**
 * Import Dependencies
 */
import { SET_USER } from "./constants";
/**
 * Set USer
 *
 * @param {Object} data [Pagination Object]
 */
export const setUser = (data = {}) => {
  return { type: SET_USER, data };
};

import axios from "axios";
import MESSAGES from "config/messages";
import { showErrorMsg } from "./notification";
/**
 * Cancel Token
 */
const { CancelToken } = axios;

/**
 * Use to cancel Http Requests
 */
let cancelHttpTokens = [];

/**
 * Helper Params used in Request
 */
const HELPER_PARAMS = {
  callback: null, // Function|Null
  headers: {} // Additional Headers
};

/**
 * Get Common Headers
 *
 * @param {String} url
 * @param {Object} additional_headers
 *
 * @return {Object} Headers
 */
export const getCommonHeaders = (url, additional_headers = {}) => {
  try {
    const headers = {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",

      /* Additional Headers */
      ...additional_headers
    };

    return headers;
  } catch (e) {
    return {};
  }
};

/**
 * GET Request
 *
 * @param {String} url
 * @param {Object} `HELPER_PARAMS`
 */
export const httpGet = async (url, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .get(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        })
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error("-- HTTP GET -- ", e);
    return Promise.reject({});
  }
};

/**
 * POST Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPost = (
  url,
  params,
  { callback, headers } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .post(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        })
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error("-- HTTP POST -- ", e);
    return Promise.reject({});
  }
};

/**
 * PUT Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPut = (url, params, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .put(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        })
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error("-- HTTP PUT -- ", e);
    return Promise.reject({});
  }
};

/**
 * PATCH Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPatch = (
  url,
  params,
  { callback, headers } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .patch(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        })
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error("-- HTTP PATCH -- ", e);
    return Promise.reject({});
  }
};

/**
 * DELETE Request
 *
 * @param {String} url
 * @param {Object} `HELPER_PARAMS`
 */
export const httpDelete = (url, { callback, headers } = HELPER_PARAMS) => {
  try {
    console.log(headers);
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .delete(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        })
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error("-- HTTP DELETE -- ", e);
    return Promise.reject({});
  }
};

/**
 * Handle Success Response
 *
 * @param {Object|Null} res
 *
 * @return {Object|Null}
 */
export const httpHandleResponse = res => {
  cancelHttpTokens = [];
  if (!res) return Promise.reject(null);

  const r = res.data;
  return Promise.resolve(r);
};

/**
 * Handle API Error Reponse
 *
 * @param {Object|Null} error
 *
 * @return {Object|String|Null}
 */
export const httpHandleError = error => {
  /* error = { error, config, code, request, response } */
  try {
    if (!error) return Promise.reject({});

    /* Handle Cancel Request */
    cancelHttpTokens = [];
    if (!error.request) return Promise.reject("cancelled");

    const xhr = error.request;
    let err = {};
    if (xhr.response) err = extractJSON(xhr.response);

    if (xhr) {
      switch (xhr.status) {
        case 0:
          showErrorMsg(MESSAGES.check_connection);
          break;

        case 400:
          const msg = err.message ? err.message : err.error;
          showErrorMsg(msg);

          break;

        case 401:
          showErrorMsg(MESSAGES.session_expired);

          break;

        case 404:
          showErrorMsg(err.message);
          break;

        case 412:
          if (Object.keys(err.errors)[0] === "q") {
            showErrorMsg("Please enter valid location.");
          } else {
            showErrorMsg(err.errors[Object.keys(err.errors)[0]][0]);
          }
          break;

        case 422:
          if (err.errors && err.errors[0] && err.errors[0].detail) {
            showErrorMsg(err.errors[0].detail);
          } else if (Array.isArray(err.message)) {
            showErrorMsg(err.message[0]);
          } else if (err.message) {
            showErrorMsg(err.messag);
          } else {
            showErrorMsg(err[Object.keys(err)[0]]);
          }
          break;

        case 502:
          showErrorMsg(MESSAGES.bad_geteway);
          break;

        default:
          showErrorMsg(MESSAGES.internal_error);
      }
    } else {
      showErrorMsg(MESSAGES.internal_error);
    }

    return Promise.reject(err);
  } catch (e) {
    console.error("-- HTTP HANDLE ERROR -- ", e);
    return Promise.reject({});
  }
};

/**
 * Cancel Http Request
 */
export const httpCancel = () => {
  try {
    cancelHttpTokens.forEach(cancel => cancel());
    cancelHttpTokens = [];
  } catch (e) {
    cancelHttpTokens = [];
  }
};

/**
 * Extract JSON Response
 *
 * @param {JSON} json [JSON Data]
 *
 * @return {Object|String} Extarcted value or Blank Object
 */
export const extractJSON = json => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return "";
  }
};

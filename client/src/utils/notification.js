import { toast } from "react-toastify";
import React from "react";

/**
 * Show Success Notification
 *
 * @param {String} message [message to show]
 */
export const showSuccessMsg = msg => {
  showNotification(msg, "success");
};

/**
 * Show Error Notification
 *
 * @param {String} message [message to show]
 */
export const showErrorMsg = msg => {
  showNotification(msg, "error");
};

/**
 * Show Warning Notification
 *
 * @param {String} message [message to show]
 */
export const showWarnMsg = msg => {
  showNotification(msg, "warn");
};

/**
 * Show Info Notification
 *
 * @param {String} message [message to show]
 */
export const showInfoMsg = msg => {
  showNotification(msg, "info");
};

/**
 * Format amd Show Notification
 *
 * @param {String} msg
 * @param {String} type ['success', 'warn', 'info', 'error']
 *
 * @return {Object} snack
 */
const showNotification = (msg, type) => {
  toast[type](() => <div>{msg} </div>);
};

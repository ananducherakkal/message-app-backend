import { Response } from "express";
import { SendResponseResponse, SendResponseOptions } from "../types/response";
// import logger from "../logger";

const sendResponse = (
  res: Response,
  statusCode: number,
  options: SendResponseOptions
) => {
  if (options.cookies) {
    const { addCookies, removeCookies } = options.cookies;

    if (addCookies) {
      for (const key in addCookies) {
        res.cookie(key, addCookies[key].value, addCookies[key].options);
      }
    }
    if (removeCookies) {
      removeCookies.forEach((cookie) => {
        res.clearCookie(cookie);
      });
    }
  }
  if (options.send) {
    const { message, data, error, fieldError } = options.send;

    const response: SendResponseResponse = { message };
    if (data) response.data = data;
    if (error) response.error = error;
    if (fieldError) response.field_error = fieldError;

    res.status(statusCode).send(response);
  }
  if (options.redirect) {
    res.redirect(options.redirect);
  }
};

export default sendResponse;

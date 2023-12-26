import logger from "../logger";
import * as userType from "../types/user";
import sendResponse from "../utils/sendResponse";
import { Response } from "express";

/**
 * @description Fetch todo by id
 * @param {string} id - todo id
 */
export const getUserList = async (res: Response, params: userType.GetUser) => {
  logger.info("getUser service: start");

  sendResponse(res, 200, { send: { message: "Todo list" } });
};

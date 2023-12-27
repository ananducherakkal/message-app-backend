import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import logger from "../logger";
import { GetUserListQuery } from "../types/user";
import sendValidatonResponse from "../middlewares/sendValidationResponse";
import errorMessage from "../utils/errorMessage";
import { body } from "express-validator";

export const getUserList = [
  // body("name").notEmpty().withMessage(errorMessage.REQUIRED),
  // sendValidatonResponse,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("getUserList controller: start");
      const { sort, page, recordsPerPage } = req.query as GetUserListQuery;

      await userService.getUserList(res, {});
    } catch (error) {
      logger.error("getUser", error);
      next(error);
    }
  },
];

export const createUser = [
  body("name").notEmpty().withMessage(errorMessage.REQUIRED),
  body("email").notEmpty().withMessage(errorMessage.REQUIRED),
  body("password").notEmpty().withMessage(errorMessage.REQUIRED),
  sendValidatonResponse,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("createUser controller: start");
      const { name, email, password } = req.body;

      await userService.createUser(res, { name, email, password });
    } catch (error) {
      logger.error("createUser", error);
      next(error);
    }
  },
];

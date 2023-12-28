import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import logger from "../logger";
import { GetUserByIdParam, GetUserListQuery } from "../types/user.type";
import sendValidatonResponse from "../middlewares/sendValidationResponse";
import errorMessage from "../utils/errorMessage";
import { body, param, query } from "express-validator";

//========================================Fetch============================================

export const getUserList = [
  query("page").optional().default(undefined).isNumeric().toInt(),
  query("pageSize").optional().default(undefined).isNumeric().toInt(),
  sendValidatonResponse,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("getUserList controller: start");
      const { sort, page, pageSize } = req.query as GetUserListQuery;

      await userService.getUserList(res, { sort, page, pageSize });
    } catch (error) {
      logger.error("getUser", error);
      next(error);
    }
  },
];

export const getUserById = [
  param("id").isNumeric().toInt(),
  sendValidatonResponse,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("getUserById controller: start");
      const { id } = req.params as unknown as GetUserByIdParam;

      await userService.getUserById(res, { id });
    } catch (error) {
      logger.error("getUser", error);
      next(error);
    }
  },
];

//========================================Modify============================================

export const createUser = [
  body("name").notEmpty().withMessage(errorMessage.REQUIRED),
  body("email")
    .notEmpty()
    .withMessage(errorMessage.REQUIRED)
    .isEmail()
    .withMessage(errorMessage.INVALID),
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

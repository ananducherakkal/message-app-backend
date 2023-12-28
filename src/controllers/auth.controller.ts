import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import logger from "../logger";
import sendValidatonResponse from "../middlewares/sendValidationResponse";
import errorMessage from "../utils/errorMessage";
import { body, param, query } from "express-validator";

export const login = [
  body("username").notEmpty().withMessage(errorMessage.REQUIRED),
  body("password").notEmpty().withMessage(errorMessage.REQUIRED),
  sendValidatonResponse,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("login controller: start");
      const { username, password } = req.body;

      await authService.login(res, { username, password });
    } catch (error) {
      logger.error("login", error);
      next(error);
    }
  },
];

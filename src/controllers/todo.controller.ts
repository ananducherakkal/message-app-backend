import { NextFunction, Request, Response } from "express";
import * as todoService from "../services/todo.service";
import logger from "../logger";
import { GetTodoQuery } from "../types/todo";
import sendValidatonResponse from "../middlewares/sendValidationResponse";
import errorMessage from "../utils/errorMessage";
import { body } from "express-validator";

export const getTodo = [
  body("name").notEmpty().withMessage(errorMessage.REQUIRED),
  sendValidatonResponse,
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("getTodo controller: start");
    console.log("sdfll lllll");
    try {
      const { id } = req.query as GetTodoQuery;

      await todoService.getTodo(res, { id });
    } catch (error) {
      logger.error("getTodo", error);
      next(error);
    }
  },
];

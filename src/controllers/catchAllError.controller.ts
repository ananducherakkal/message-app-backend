import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";

const catchAllError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendResponse(res, 500, {
    send: {
      message: "Internal Server Error",
      error: error.message,
    },
  });
};

export default catchAllError;

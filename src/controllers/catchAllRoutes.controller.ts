import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";

const catchAllRoutes = (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 404, {
    send: {
      message: "Cannot find the api",
    },
  });
};

export default catchAllRoutes;

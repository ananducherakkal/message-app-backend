import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendResponse";

const sendValidatonResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req).formatWith(
    ({ msg, nestedErrors }: any) => {
      if (nestedErrors) return nestedErrors;
      if (msg) return msg;
    }
  );

  if (!error.isEmpty()) {
    const errorMapped = error.mapped();
    if (errorMapped["_error"]) {
      errorMapped["_error"].forEach((value: { param: string; msg: string }) => {
        errorMapped[value.param] = value.msg;
      });
      delete errorMapped["_error"];
    }
    return sendResponse(res, 400, {
      send: {
        message: "Validation failed",
        fieldError: errorMapped,
      },
    });
  }
  next();
};

export default sendValidatonResponse;

import logger from "../logger";
import { db } from "../models";
import * as authType from "../types/auth.type";
import { compareHash } from "../utils/hash";
import { createToken } from "../utils/jwt";
import sendResponse from "../utils/sendResponse";
import { Response } from "express";

//========================================Fetch============================================
/**
 * @description Fetch user list
 * @param {string} username - user's email
 * @param {string} password - user's password
 */
export const login = async (res: Response, params: authType.Login) => {
  logger.info("login service: start");

  const { username, password } = params;

  const user = await db.User.findOne({
    where: { email: username },
  });

  if (!user) {
    return sendResponse(res, 404, { send: { message: "User does not exits" } });
  }

  const passwordMatch = await compareHash(password, user.password || "");

  if (!passwordMatch) {
    return sendResponse(res, 400, { send: { message: "Invalid credentials" } });
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  // Generate accessToken and refreshToken
  const accessToken = createToken(payload, "8h");
  const refreshToken = createToken(payload, "8h");

  sendResponse(res, 200, {
    send: {
      message: "Fetch User successfully",
      data: {
        auth_token: accessToken,
      },
    },
    cookies: {
      addCookies: {
        [process.env.refreshTokenName as string]: {
          value: refreshToken,
          options: {
            httpOnly: true,
            secure: false,
            maxAge: 8 * 60 * 60 * 1000,
          },
        },
      },
    },
  });
};

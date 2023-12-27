import logger from "../logger";
import { db } from "../models";
import * as userType from "../types/user";
import { throwDbError } from "../utils/dbError";
import { hash } from "../utils/hash";
import sendResponse from "../utils/sendResponse";
import { Response } from "express";

//========================================Fetch============================================
/**
 * @description Fetch todo by id
 * @param {string} id - todo id
 */
export const getUserList = async (res: Response, params: userType.GetUser) => {
  logger.info("getUser service: start");

  sendResponse(res, 200, { send: { message: "Todo list" } });
};

/**
 * @description Fetch todo by id
 * @param {string} id - todo id
 */
export const getUserById = async (res: Response, params: userType.GetUser) => {
  logger.info("getUser service: start");

  sendResponse(res, 200, { send: { message: "Todo list" } });
};

//========================================Modify============================================
/**
 * @description Fetch todo by id
 * @param {string} name - user's name
 * @param {string} email - user's email
 * @param {string} password - user's password
 */
export const createUser = async (
  res: Response,
  params: userType.CreateUser
) => {
  logger.info("createUser service: start");

  const { name, email, password } = params;

  // Check for user with duplicate email
  const duplicateUser = await db.User.findAll({ where: { email } });

  if (duplicateUser?.length) {
    return sendResponse(res, 400, {
      send: {
        message: "Validation faile",
        fieldError: {
          email: "User with this email already exists.",
        },
      },
    });
  }

  // Hash password
  const hashPassword = password ? await hash(password) : undefined;

  // Create user in database
  const user = await db.User.create({
    name,
    email,
    password: hashPassword,
  });

  const publicUser = user.toJSON();
  delete publicUser.password;

  sendResponse(res, 201, {
    send: { message: "Fetch User successfully", data: { user: publicUser } },
  });
};

import logger from "../logger";
import { db } from "../models";
import * as userType from "../types/user.type";
import { throwDbError } from "../utils/dbError";
import { hash } from "../utils/hash";
import { getLimitOffset } from "../utils/pagination";
import sanitizeSort from "../utils/sanitizeSort";
import sendResponse from "../utils/sendResponse";
import { Response } from "express";

//========================================Fetch============================================
/**
 * @description Fetch user list
 * @param {string | string[]} sort - to set order example: name_asc, name_desc
 * @param {number} page - page number for pagination
 * @param {number} pageSize - page size for pagination
 */
export const getUserList = async (
  res: Response,
  params: userType.GetUserList
) => {
  logger.info("getUser service: start");

  const { sort, page, pageSize } = params;

  const { limit, offset } = getLimitOffset(page, pageSize);
  const order = sanitizeSort(sort, ["name", "email"]);

  const users = await db.User.findAll({
    order,
    limit,
    offset,
    attributes: {
      exclude: ["password"],
    },
  });

  const totalCount = await db.User.findAndCountAll();

  sendResponse(res, 200, {
    send: {
      message: "Fetch User successfully",
      data: {
        users: users,
        total_count: totalCount?.count,
      },
    },
  });
};

/**
 * @description Fetch user by id
 * @param {number} id - user id
 */
export const getUserById = async (
  res: Response,
  params: userType.GetUserById
) => {
  logger.info("getUser service: start");
  const { id } = params;

  const user = await db.User.findOne({
    where: { id },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return sendResponse(res, 404, {
      send: { message: "Cannot find user with id" },
    });
  }

  sendResponse(res, 200, {
    send: { message: "Succesfully fetched user details", data: { user } },
  });
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
        message: "Validation failed",
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
    send: { message: "User Created successfully", data: { user: publicUser } },
  });
};

import logger from "../logger";
import { db } from "../models";
import * as messageType from "../types/message.type";
import { hash } from "../utils/hash";
import { getLimitOffset } from "../utils/pagination";
import sanitizeSort from "../utils/sanitizeSort";
import sendResponse from "../utils/sendResponse";
import { Response } from "express";

//========================================Fetch============================================
/**
 * @description Fetch message list
 * @param {number} page - page number for pagination
 * @param {number} pageSize - page size for pagination
 */
export const getMessageList = async (
  res: Response,
  params: messageType.GetMessageList
) => {
  logger.info("getMessageList service: start");

  const { page, pageSize } = params;

  const { limit, offset } = getLimitOffset(page, pageSize);

  const messages = await db.Message.findAll({
    order: [["send_time", "DESC"]],
    limit,
    offset,
  });

  const totalCount = await db.Message.findAndCountAll();

  sendResponse(res, 200, {
    send: {
      message: "Fetch Message successfully",
      data: {
        messages,
        total_count: totalCount?.count,
      },
    },
  });
};

/**
 * @description Fetch message by id
 * @param {number} id - message id
 */
export const getMessageById = async (
  res: Response,
  params: messageType.GetMessageById
) => {
  logger.info("getMessageById service: start");
  const { id } = params;

  const message = await db.Message.findOne({
    where: { id },
  });

  if (!message) {
    return sendResponse(res, 404, {
      send: { message: "Cannot find message with id" },
    });
  }

  sendResponse(res, 200, {
    send: { message: "Succesfully fetched message details", data: { message } },
  });
};

//========================================Modify============================================
/**
 * @description Fetch todo by id
 * @param {string} text - message text
 * @param {string} from - sender's id (User table)
 * @param {string} to - receiver's id (User table)
 */
export const createMessage = async (
  res: Response,
  params: messageType.CreateMessage
) => {
  logger.info("createUser service: start");

  const { text, from, to } = params;

  // Create message in database
  const message = await db.Message.create({
    text,
    from,
    to,
    status: "pending",
    send_time: new Date(Date.now()),
    delivered_time: undefined,
    seen_time: undefined,
  });

  sendResponse(res, 201, {
    send: {
      message: "User Created successfully",
      data: { message: message.toJSON() },
    },
  });
};

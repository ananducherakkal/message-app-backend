import logger from "../logger";

const jwt = require("jsonwebtoken");

export const createToken = (payload: any, expiry: string): string => {
  logger.info(`jwt/createUserToken ~ end`);
  return jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: expiry,
    algorithm: "HS256",
  });
};

export const verfiryToken = (
  token: string
): Promise<{ verify: boolean; decoded: any }> => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_TOKEN, (error: any, decoded: any) => {
      if (error) resolve({ verify: false, decoded: null });
      resolve({ verify: true, decoded });
    });
  });
};

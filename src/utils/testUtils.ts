import { NextFunction, Request, Response } from "express";

type requestParamsType = {
  body?: any;
  query?: any;
  params?: any;
};

export const createRequest = ({ body, query, params }: requestParamsType) => {
  const request = {
    body: body || {},
    query: query || {},
    params: params || {},
  } as Request;
  return request;
};

export const createResponse = () => {
  const res: any = {};
  res.status = jest.fn((x) => res);
  res.send = jest.fn((x) => res);

  return res as unknown as Response;
};

export const mockFind = () => {
  type responseType = {
    select: () => responseType;
    sort: () => responseType;
    skip: () => responseType;
    limit: () => responseType;
  };
  const response: responseType = {
    select: jest.fn(() => response),
    sort: jest.fn(() => response),
    skip: jest.fn(() => response),
    limit: jest.fn(() => response),
  };
  return response;
};

export const createNext = jest.fn((x) => x) as unknown as NextFunction;

export const testController = async (
  controller: Array<(req: Request, res: Response, next: NextFunction) => any>,
  req: Request,
  res: Response
) => {
  for (let index = 0; index < controller.length; index++) {
    let nextExecuted = false;
    await controller[index](req, res, () => {
      nextExecuted = true;
    });
    if (!nextExecuted) break;
  }
};

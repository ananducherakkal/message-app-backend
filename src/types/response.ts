import { CookieOptions, Response } from "express";

type SendResponseSend = {
  message: string;
  data?: any;
  error?: string;
  fieldError?: any;
};
type SendResponseCookies = {
  [key: string]: {
    value: string;
    options: CookieOptions;
  };
};
type SendResponseRedirect = string;

export type SendResponseOptions = {
  send?: SendResponseSend;
  cookies?: {
    addCookies?: SendResponseCookies;
    removeCookies?: Array<string>;
  };
  redirect?: SendResponseRedirect;
};

export type SendResponseResponse = {
  message: string;
  data?: any;
  error?: string;
  field_error?: any;
};

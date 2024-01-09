export type MessageStatus = "pending" | "delivered" | "seen";

export type CreateMessage = {
  text: string;
  from: number;
  to: number;
};

export type GetMessageList = {
  page?: number;
  pageSize?: number;
};

export type GetMessageById = {
  id: number;
};

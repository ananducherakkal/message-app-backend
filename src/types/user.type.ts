export type GetUserList = {
  sort?: string | string[];
  page?: number;
  pageSize?: number;
};

export type GetUserListQuery = {
  sort?: string | string[];
  page?: number;
  pageSize?: number;
};

export type GetUserById = {
  id: number;
};

export type GetUserByIdParam = {
  id: number;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

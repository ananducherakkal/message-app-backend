export type GetUser = {};

export type GetUserListQuery = {
  sort?: string | string[];
  page?: number | string;
  recordsPerPage?: number | string;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

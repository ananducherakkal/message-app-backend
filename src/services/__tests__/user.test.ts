import * as userService from "../user.service";
import {
  createRequest,
  createResponse,
  makePromise,
} from "../../utils/testUtils";
import { db } from "../../models";

jest.mock("../../models", () => ({
  db: {
    User: {
      findAll: jest.fn(),
      create: jest.fn(),
    },
  },
}));

let res = createResponse();

beforeEach(() => {
  jest.resetAllMocks();
  res = createResponse();
});

describe("createUser", () => {
  const data = {
    name: "User",
    email: "user@email.com",
    password: "pass@123",
  };

  beforeEach(() => {
    (db.User.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...data,
      toJSON: () => ({ id: 1, ...data }),
    });
  });

  describe("when passed with correct data", () => {
    beforeEach(() => {
      (db.User.findAll as jest.Mock).mockResolvedValue(null);
    });

    it("should return with 201", async () => {
      await userService.createUser(res, data);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            user: {
              id: expect.anything(),
              name: data.name,
              email: data.email,
              password: undefined,
            },
          },
        })
      );
    });

    it("should return save password as dycript", async () => {
      await userService.createUser(res, data);
      expect(db.User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringMatching(data.password),
        })
      );
    });
  });
  describe("when passed with duplicate email", () => {
    beforeEach(() => {
      (db.User.findAll as jest.Mock).mockResolvedValue([{}]);
    });
    it("should return with 400 error", async () => {
      await userService.createUser(res, data);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          field_error: {
            email: expect.anything(),
          },
        })
      );
    });
  });
});

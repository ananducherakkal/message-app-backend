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
      findOne: jest.fn(),
      create: jest.fn(),
      findAndCountAll: jest.fn(),
    },
  },
}));

let res = createResponse();

beforeEach(() => {
  jest.resetAllMocks();
  res = createResponse();
});

//===========================createUser==========================

describe("createUser service", () => {
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

//===========================getUserList==========================

describe("getUserList service", () => {
  beforeEach(() => {
    (db.User.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "user",
        email: "user@email.com",
      },
    ]);
    (db.User.findAndCountAll as jest.Mock).mockResolvedValue({ count: 10 });
  });
  describe("when passed with sort", () => {
    it("should send correct object", async () => {
      const sort = ["name,desc", "other,asc", "email"];
      await userService.getUserList(res, { sort });
      expect(db.User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [
            ["name", "DESC"],
            ["email", "ASC"],
          ],
          limit: parseInt(process.env.PAGE_SIZE as string),
          offset: 0,
        })
      );
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            users: expect.arrayContaining([
              expect.not.objectContaining({
                password: expect.anything(),
              }),
            ]),
            total_count: expect.any(Number),
          },
        })
      );
    });
  });
  describe("when passed with page and pageSize", () => {
    it("should calculate correct limit and offset", async () => {
      const page = 3;
      const pageSize = 10;
      await userService.getUserList(res, { page, pageSize });
      expect(db.User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [],
          limit: 10,
          offset: 20,
        })
      );
    });
  });
});

//===========================getUserById==========================

describe("getUserById service", () => {
  describe("when passed with valid id", () => {
    beforeEach(() => {
      (db.User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: "user",
        email: "user@email.com",
      });
    });
    it("should send 200", async () => {
      await userService.getUserById(res, { id: 1 });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            user: expect.anything(),
          },
        })
      );
    });
  });
  describe("when passed with invlid id", () => {
    beforeEach(() => {
      (db.User.findOne as jest.Mock).mockResolvedValue(null);
    });
    it("should send 404", async () => {
      await userService.getUserById(res, { id: 1 });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.not.objectContaining({
          data: expect.anything(),
        })
      );
    });
  });
});

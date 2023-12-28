import {
  createRequest,
  createResponse,
  testController,
} from "../../utils/testUtils";
import * as userController from "../user.controller";
import * as userService from "../../services/user.service";

jest.mock("../../services/user.service");

let res = createResponse();

beforeEach(() => {
  jest.resetAllMocks();
  res = createResponse();
});

//===========================createUser==========================

describe("createUser Controller", () => {
  const body = {
    name: "User",
    email: "user@email.com",
    password: "pass2323",
  };
  describe("when all field are not passed", () => {
    it("should return with 400", async () => {
      let req = createRequest({});

      await testController(userController.createUser, req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenLastCalledWith(
        expect.objectContaining({
          field_error: {
            name: expect.anything(),
            email: expect.anything(),
            password: expect.anything(),
          },
        })
      );
    });
  });
  describe("when invalid email is passed", () => {
    it("should return with 400", async () => {
      let req = createRequest({ body: { ...body, email: "invalidemail" } });

      await testController(userController.createUser, req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenLastCalledWith(
        expect.objectContaining({
          field_error: {
            name: undefined,
            email: expect.anything(),
            password: undefined,
          },
        })
      );
    });
  });
  describe("when all field are passed", () => {
    it("should call createUser service", async () => {
      let req = createRequest({ body });

      await testController(userController.createUser, req, res);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
    });
  });
});

//===========================getUserList==========================
describe("getUserList Controller", () => {
  const query = {
    sort: "name_asc",
    page: "1",
    pageSize: "5",
  };
  describe("when all query field are passed", () => {
    it("should call getUserList service", async () => {
      let req = createRequest({ query });

      await testController(userController.getUserList, req, res);
      expect(userService.getUserList).toHaveBeenLastCalledWith(
        res,
        expect.objectContaining({
          sort: "name_asc",
          page: 1,
          pageSize: 5,
        })
      );
    });
  });
  describe("when no query field are passed", () => {
    it("should call getUserList service", async () => {
      let req = createRequest({});

      await testController(userController.getUserList, req, res);
      expect(userService.getUserList).toHaveBeenLastCalledWith(
        res,
        expect.objectContaining({
          sort: undefined,
          page: undefined,
          pageSize: undefined,
        })
      );
    });
  });
});

//===========================getUserById==========================
describe("getUserById Controller", () => {
  describe("when passed with id as string", () => {
    it("should call getUserById with id as number", async () => {
      let req = createRequest({ params: { id: "1" } });

      await testController(userController.getUserById, req, res);
      expect(userService.getUserById).toHaveBeenLastCalledWith(res, { id: 1 });
    });
  });
  describe("when passed invalid id which is not number", () => {
    it("should return 400 with invalid id", async () => {
      let req = createRequest({ params: { id: "invalid" } });

      await testController(userController.getUserById, req, res);
      expect(userService.getUserById).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

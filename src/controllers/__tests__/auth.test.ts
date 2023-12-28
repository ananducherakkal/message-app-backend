import {
  createRequest,
  createResponse,
  testController,
} from "../../utils/testUtils";
import * as authController from "../auth.controller";
import * as authService from "../../services/auth.service";

jest.mock("../../services/auth.service");

let res = createResponse();

beforeEach(() => {
  jest.resetAllMocks();
  res = createResponse();
});

//===========================authController==========================

describe("authController Controller", () => {
  describe("when all field are not passed", () => {
    it("should return with 400", async () => {
      let req = createRequest({});

      await testController(authController.login, req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenLastCalledWith(
        expect.objectContaining({
          field_error: {
            username: expect.anything(),
            password: expect.anything(),
          },
        })
      );
    });
  });
  describe("when all field are passed", () => {
    it("should call login service", async () => {
      let req = createRequest({
        body: {
          username: "user@email.com",
          password: "password",
        },
      });
      await testController(authController.login, req, res);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});

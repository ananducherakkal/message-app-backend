import {
  createRequest,
  createResponse,
  testController,
} from "../../utils/testUtils";
import * as todoController from "../todo.controller";
import * as todoService from "../../services/todo.service";

jest.mock("../../services/todo.service");

afterEach(() => {
  jest.resetAllMocks();
});

describe("getTodo Controller", () => {
  describe("when all field are not passed", () => {
    it("should return with 400", async () => {
      let req = createRequest({});
      let res = createResponse();

      await testController(todoController.getTodo, req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
  describe("when all field are passed", () => {
    it("should return with 200", async () => {
      let req = createRequest({ body: { name: "sdf" } });
      let res = createResponse();

      await testController(todoController.getTodo, req, res);
      expect(todoService.getTodo).toHaveBeenCalledTimes(1);
    });
  });
});

import { getTodo } from "../todo.service";
import { createRequest, createResponse } from "../../utils/testUtils";

let req = createRequest({});
let res = createResponse();

beforeEach(() => {
  jest.resetAllMocks();
  req = createRequest({});
  res = createResponse();
});

describe("getTodo", () => {
  describe("when passing correct id", () => {
    it("should return with 200", async () => {
      await getTodo(res, { id: "1" });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.anything(),
        })
      );
    });
  });
});

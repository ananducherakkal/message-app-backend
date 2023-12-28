import * as authService from "../auth.service";
import {
  createRequest,
  createResponse,
  makePromise,
} from "../../utils/testUtils";
import { db } from "../../models";

jest.mock("../../models", () => ({
  db: {
    User: {
      findOne: jest.fn(),
    },
  },
}));

let res = createResponse();

beforeEach(() => {
  jest.resetAllMocks();
  res = createResponse();
});

//===========================login==========================

describe("login service", () => {
  const data = {
    username: "user@email.com",
    password: "password@123",
  };

  describe("when passed with correct credentials", () => {
    beforeEach(() => {
      (db.User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        username: "user@email.com",
        password:
          "$2a$12$8U/kW8jn/nDaGU3e5fulJ.UueZTFdIfUXlm1RAjdHDD8LWv054Nze",
      });
    });

    it("should return with 200", async () => {
      await authService.login(res, data);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            auth_token: expect.anything(),
          },
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        process.env.refreshTokenName,
        expect.anything(),
        expect.anything()
      );
    });
    describe("when passed with incorrect password", () => {
      beforeEach(() => {
        (db.User.findOne as jest.Mock).mockResolvedValue({
          id: 1,
          username: "user@email.com",
          password:
            "$2a$12$8U/kW3jn/nDaGU3e5fulJ.UueZTFdIfUXlm1RAjdHDD8LWv054Nze",
        });
      });

      it("should return with 400", async () => {
        await authService.login(res, data);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
          expect.not.objectContaining({
            data: expect.anything(),
          })
        );
      });
    });
    describe("when passed with invalid email", () => {
      beforeEach(() => {
        (db.User.findOne as jest.Mock).mockResolvedValue(null);
      });

      it("should return with 404", async () => {
        await authService.login(res, data);
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
});

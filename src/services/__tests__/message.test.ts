import * as messageService from "../message.service";
import {
  createRequest,
  createResponse,
  makePromise,
} from "../../utils/testUtils";
import { db } from "../../models";

jest.mock("../../models", () => ({
  db: {
    Message: {
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

//===========================createMessage==========================

describe("createMessage service", () => {
  const data = {
    text: "Hej! Hur mår du",
    from: 1,
    to: 2,
  };

  beforeEach(() => {
    (db.Message.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...data,
      toJSON: () => ({ id: 1, ...data }),
    });
  });

  describe("when passed with correct data", () => {
    it("should return with 201", async () => {
      await messageService.createMessage(res, data);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            message: expect.anything(),
          },
        })
      );
    });
  });
});

//===========================getMessageList==========================

describe("getMessageList service", () => {
  beforeEach(() => {
    (db.Message.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        text: "something",
      },
    ]);
    (db.Message.findAndCountAll as jest.Mock).mockResolvedValue({ count: 10 });
  });
  describe("when passed with sort", () => {
    it("should send correct object", async () => {
      await messageService.getMessageList(res, {});
      expect(db.Message.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [["send_time", "DESC"]],
          limit: parseInt(process.env.PAGE_SIZE as string),
          offset: 0,
        })
      );
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            messages: expect.anything(),
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
      await messageService.getMessageList(res, { page, pageSize });
      expect(db.Message.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [["send_time", "DESC"]],
          limit: 10,
          offset: 20,
        })
      );
    });
  });
});

//===========================getMessageById==========================

describe("getMessageById service", () => {
  describe("when passed with valid id", () => {
    beforeEach(() => {
      (db.Message.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        text: "somehthing",
      });
    });
    it("should send 200", async () => {
      await messageService.getMessageById(res, { id: 1 });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            message: expect.anything(),
          },
        })
      );
    });
  });
  describe("when passed with invlid id", () => {
    beforeEach(() => {
      (db.Message.findOne as jest.Mock).mockResolvedValue(null);
    });
    it("should send 404", async () => {
      await messageService.getMessageById(res, { id: 1 });
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

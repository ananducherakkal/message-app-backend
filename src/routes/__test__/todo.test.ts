import supertest from "supertest";
import app from "../../app";

const request = supertest(app);

describe("Get todo by id", () => {
  it("should return with 200", async () => {
    const data = {
      name: "name",
    };
    // const response = await request.post("/todo").send(data);
    const response = await request.get("/todo");

    expect(response.status).toBe(400);
  });
});

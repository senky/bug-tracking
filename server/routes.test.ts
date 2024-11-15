import app from "./app";
import { describe, it, expect } from "vitest";
import request from "supertest";

describe("POST /create", () => {
  it("should return 400 when no data are passed", async () => {
    const response = await request(app).post("/create");
    expect(response.status).to.equal(400);
  });

  it("should return 400 when wrong data are passed", async () => {
    const response = await request(app).post("/create").send({
      parentId: "number 1",
      description: 0,
      link: "just text",
    });
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      errors: [
        {
          location: "body",
          msg: "Invalid value",
          path: "parentId",
          type: "field",
          value: "number 1",
        },
        {
          location: "body",
          msg: "Invalid value",
          path: "description",
          type: "field",
          value: 0,
        },
        {
          location: "body",
          msg: "Invalid value",
          path: "link",
          type: "field",
          value: "just text",
        },
      ],
    });
  });

  it("should return 201 when correct data are passed", async () => {
    const response = await request(app).post("/create").send({
      parentId: "1",
      description: "test",
      link: "http://test.com",
    });
    expect(response.body).to.be.empty;
    expect(response.status).to.equal(201);
  });
});

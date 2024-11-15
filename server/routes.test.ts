import appInit from "./app";
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { CsvTestAdapter } from "./storage-adapters/csv/csv-test-adapter";

const adapter = new CsvTestAdapter();
const app = appInit(adapter);

describe("POST /create", () => {
  beforeEach(() => {
    adapter.issues = [];
  });

  it("should return 400 when no data are passed", async () => {
    const response = await request(app).post("/create");
    expect(response.status).to.equal(400);
    expect(adapter.issues).to.have.length(0);
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
    expect(adapter.issues).to.have.length(0);
  });

  it("should return 201 when correct data are passed", async () => {
    const response = await request(app).post("/create").send({
      parentId: "1",
      description: "test",
      link: "http://test.com",
    });
    expect(response.body).to.be.empty;
    expect(response.status).to.equal(201);
    expect(adapter.issues).to.have.length(1);
  });
});

describe("PUT /close", () => {
  beforeEach(() => {
    adapter.issues = [
      {
        id: 1,
        parentId: undefined,
        description: "test",
        link: "http://test.com",
        status: "open",
        creationTimestamp: new Date().toISOString(),
      },
    ];
  });

  it("should return 400 when no data are passed", async () => {
    const response = await request(app).put("/close");
    expect(response.status).to.equal(400);
    expect(adapter.issues[0].status).to.equal("open");
  });

  it("should return 400 when wrong data are passed", async () => {
    const response = await request(app).put("/close").send({
      id: "abc",
    });
    expect(response.status).to.equal(400);
    expect(adapter.issues[0].status).to.equal("open");
  });

  it("should return 400 when wrong data are passed", async () => {
    const response = await request(app).put("/close").send({
      id: "abc",
    });
    expect(response.status).to.equal(400);
    expect(adapter.issues[0].status).to.equal("open");
  });

  it("should return 410 when non-existing ID is passed", async () => {
    const response = await request(app).put("/close").send({
      id: 2,
    });
    expect(response.status).to.equal(410);
    expect(adapter.issues[0].status).to.equal("open");
  });

  it("should return 204 when correct data are passed", async () => {
    const response = await request(app).put("/close").send({
      id: 1,
    });
    expect(response.status).to.equal(204);
    expect(adapter.issues[0].status).to.equal("closed");
  });
});

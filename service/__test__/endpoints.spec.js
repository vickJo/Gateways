const request = require("supertest");
const app = require("../app");

jest.mock("../models", () => {
  function Gateway() {
    return {
      save: jest.fn(),
    };
  }

  Gateway.find = async function () {
    return [];
  };

  Gateway.findById = async function (...args) {
    return args[0] === "123" ? {} : undefined;
  };

  Gateway.findByIdAndUpdate = async function (...args) {
    return {};
  };

  Gateway.findByIdAndDelete = async function (...args) {
    return {};
  };

  return {
    Gateway,
  };
});

describe("endpooints", () => {
  test("GET /gateways", async () => {
    const res = await request(app).get("/gateways");

    expect(res.statusCode).toBe(200);
  });

  test("GET /gateways/id", async () => {
    const itExistRes = await request(app).get("/gateways/123");
    const notExistRes = await request(app).get("/gateways/456");

    expect(itExistRes.statusCode).toBe(200);
    expect(notExistRes.statusCode).toBe(404);
  });

  test("POST /gateways", async () => {
    const badRes = await request(app).post("/gateways").send({
      name: "gate",
      ipv4Address: "12.12.1",
      peripherals: [],
    });
    const goodRes = await request(app).post("/gateways").send({
      name: "gate",
      ipv4Address: "12.12.12.12",
      peripherals: [],
    });

    expect(badRes.statusCode).toBe(400);
    expect(goodRes.statusCode).toBe(201);
  });

  test("PATCH /gateways/id", async () => {
    const generateDevices = (count) => {
      return Array(count)
        .fill(1)
        .map((n, i) => ({ vendor: `vendor${i}`, status: "online" }));
    };

    const badRes = await request(app)
      .patch("/gateways/123")
      .send({ peripherals: generateDevices(12) });

    const goodRes = await request(app)
      .patch("/gateways/123")
      .send({ peripherals: generateDevices(10) });

    expect(badRes.statusCode).toBe(400);
    expect(goodRes.statusCode).toBe(200);
  });

  test("DELETE /gateways/id", async () => {
    const res = await request(app).delete("/gateways/123");

    expect(res.statusCode).toBe(200);
  });
});

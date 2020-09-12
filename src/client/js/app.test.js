const request = require("supertest");
const server = require("../../server/server");

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(server)
      .get("/")
      .expect(200);
  });
});
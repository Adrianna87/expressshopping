process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let item = { name: "pasta", price: 1.69 }

beforeEach(function () {
  items.push(item)
});

afterEach(function () {
  items.length = 0;
});

describe("GET /item", function () {
  test("Get all items", async function () {
    const res = await request(app).get("/item");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [item] })
  })
})

describe("GET /item/:name", function () {
  test("Gets a single item", async function () {
    const resp = await request(app).get(`/item/${item.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({ item });
  });

  test("Responds with 404 if can't find item", async function () {
    const resp = await request(app).get(`/item/spaghetti`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("POST /item", function () {
  test("Creates a new item", async function () {
    const resp = await request(app)
      .post(`/item`)
      .send({
        name: "soup",
        price: 1.25
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ item: { name: "soup", price: 1.25 } });
  });
  test("Responds with 400 if name of item is missing", async function () {
    const resp = await request(app)
      .post(`/item`)
      .send({
        price: 1.25
      });
    expect(resp.statusCode).toBe(400);
    expect(resp.body).toEqual({ error: "Name is required" });
  });
});

describe("PATCH /item/:name", function () {
  test("Updates a single item", async function () {
    const resp = await request(app)
      .patch(`/item/${item.name}`)
      .send({
        name: "maccaroni"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      item: { name: "maccaroni", price: 1.69 }
    });
  });

  test("Responds with 404 if id invalid", async function () {
    const resp = await request(app).patch(`/item/asd`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /item/:name", function () {
  test("Deletes a single item", async function () {
    const resp = await request(app).delete(`/item/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
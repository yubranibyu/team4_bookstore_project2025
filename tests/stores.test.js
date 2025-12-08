const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

jest.setTimeout(30000);

let testStoreId;

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDB((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

afterAll(async () => {
  await mongodb.closeDB();
});

describe("Stores GET Endpoints", () => {
  beforeAll(async () => {
    const db = mongodb.getDB();
    const result = await db.collection("stores").insertOne({
      name: "Test Store",
      location: "Test City",
      openSince: 2010,
    });
    testStoreId = result.insertedId.toString();
  });

  afterAll(async () => {
    const db = mongodb.getDB();
    await db.collection("stores").deleteOne({ _id: new ObjectId(testStoreId) });
  });

  test("GET /stores should return 200", async () => {
    const res = await request(app).get("/stores");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /stores/:id should return a store", async () => {
    const res = await request(app).get(`/stores/${testStoreId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testStoreId);
  });

  test("GET /stores/invalidID should return 400", async () => {
    const res = await request(app).get("/stores/1234");
    expect(res.statusCode).toBe(400);
  });

  test("GET /stores/:id should return 404 when not found", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/stores/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

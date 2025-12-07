const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

jest.setTimeout(30000);

let testSubscriberId;

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

describe("Subscribers GET Endpoints", () => {
  beforeAll(async () => {
    const db = mongodb.getDB();
    const result = await db.collection("subscriber").insertOne({
      subscribername: "Tester",
      email: "test@example.com",
      accessToken: "abc123token",
      role: "admin",
    });
    testSubscriberId = result.insertedId.toString();
  });

  afterAll(async () => {
    const db = mongodb.getDB();
    await db.collection("subscriber").deleteOne({ _id: new ObjectId(testSubscriberId) });
  });

  test("GET /subscriber should return 200", async () => {
    const res = await request(app).get("/subscriber");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /subscriber/:id should return a subscriber", async () => {
    const res = await request(app).get(`/subscriber/${testSubscriberId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testSubscriberId);
  });

  test("GET /subscriber/invalidID should return 400", async () => {
    const res = await request(app).get("/subscriber/1234");
    expect(res.statusCode).toBe(400);
  });

  test("GET /subscriber/:id should return 404 when not found", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/subscriber/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

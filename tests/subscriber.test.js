const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

let testId;

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDB((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
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
    testId = result.insertedId.toString();
  });

  afterAll(async () => {
    const db = mongodb.getDB();
    await db.collection("subscriber").deleteOne({ _id: new ObjectId(testId) });
  });

  test("GET /subscriber should return 200", async () => {
    const res = await request(app).get("/subscriber");
    expect(res.statusCode).toBe(200);
  });

  test("GET /subscriber/:id should return subscriber", async () => {
    const res = await request(app).get(`/subscriber/${testId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testId);
  });

  test("GET /subscriber/invalidID returns 400", async () => {
    const res = await request(app).get("/subscriber/xyz");
    expect(res.statusCode).toBe(400);
  });

  test("GET /subscriber/:id returns 404 when not found", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/subscriber/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

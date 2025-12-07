const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

jest.setTimeout(30000);

let testId;

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

describe("Authors GET Endpoints", () => {
  beforeAll(async () => {
    const db = mongodb.getDB();
    const result = await db.collection("authors").insertOne({
      name: "Test Author",
      birthYear: 1990,
      nationality: "Testland",
      awards: [],
      numBooksWritten: 3,
    });
    testId = result.insertedId.toString();
  });

  afterAll(async () => {
    const db = mongodb.getDB();
    await db.collection("authors").deleteOne({ _id: new ObjectId(testId) });
  });

  test("GET /authors should return 200", async () => {
    const res = await request(app).get("/authors");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /authors/:id should return an author", async () => {
    const res = await request(app).get(`/authors/${testId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testId);
  });

  test("GET /authors/invalidID should return 400", async () => {
    const res = await request(app).get("/authors/1234");
    expect(res.statusCode).toBe(400);
  });

  test("GET /authors/:id should return 404 when not found", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/authors/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

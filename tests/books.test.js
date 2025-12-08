const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

jest.setTimeout(30000);

let testBookId;

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

describe("Books GET Endpoints", () => {
  beforeAll(async () => {
    const db = mongodb.getDB();
    const result = await db.collection("books").insertOne({
      title: "Test Book",
      author: "Test Author",
      pages: 100,
      genre: "Test Genre",
      publishedYear: 2020,
    });
    testBookId = result.insertedId.toString();
  });

  afterAll(async () => {
    const db = mongodb.getDB();
    await db.collection("books").deleteOne({ _id: new ObjectId(testBookId) });
  });

  test("GET /books should return 200", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /books/:id should return a book", async () => {
    const res = await request(app).get(`/books/${testBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testBookId);
  });

  test("GET /books/invalidID should return 400", async () => {
    const res = await request(app).get("/books/1234");
    expect(res.statusCode).toBe(400);
  });

  test("GET /books/:id should return 404 when not found", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/books/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

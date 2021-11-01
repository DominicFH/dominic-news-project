const db = require("../db/index.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
	it("status 200: responds with an array of topic objects which have a slug and description property", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				expect(body["topics"].length).toBe(3);
				body["topics"].forEach((topic) => {
					expect(topic).toEqual({
						description: expect.any(String),
						slug: expect.any(String),
					});
				});
			});
	});
	it("status 400: responds with error message if url entered incorrectly", () => {
		return request(app)
			.get("/api/catpics")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid path");
			});
	});
});

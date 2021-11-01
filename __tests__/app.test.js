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
	it("status 404: responds with error message if url entered incorrectly", () => {
		return request(app)
			.get("/api/catpics")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid path");
			});
	});
});
describe("GET /api/articles/:article_id", () => {
	it("status 200: responds with an article object for the requested article id", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				expect(body.article[0]).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: expect.any(Number),
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					comment_count: expect.any(String),
				});
			});
	});
	it("status 404: responds with error message if article id is invalid ", () => {
		return request(app)
			.get("/api/articles/99")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("No article found");
			});
	});
});

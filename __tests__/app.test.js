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
	it("status 404: responds with error message if article id is not in the database ", () => {
		const article_id = 99;
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("No article found");
			});
	});
	it("status 400: responds with error message if article id is an invalid data type", () => {
		const article_id = "HELLO";
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input");
			});
	});
});
describe("PATCH /api/articles/:article_id", () => {
	it("status 200: responds with an article with votes updated using the input object", () => {
		const incVotesObj = { inc_votes: 3 };
		const article_id = 1;
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(incVotesObj)
			.expect(200)
			.then(({ body }) => {
				expect(body.updated_article[0]).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: expect.any(Number),
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
				});
				expect(body.updated_article[0].votes).toBe(103);
			});
	});
	it("status 404: responds with error message if article is is not in the database", () => {
		const incVotesObj = { inc_votes: 3 };
		const article_id = 99;
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(incVotesObj)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("No article found");
			});
	});
	it("status 400: responds with error message if article id is an invalid date type", () => {
		const incVotesObj = { inc_votes: 3 };
		const article_id = "HELLO";
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(incVotesObj)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input");
			});
	});
	it("status 400: responds with error message if request body is invalid", () => {
		const incVotesObj = { inc_dates: 3 };
		const article_id = 1;
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(incVotesObj)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input");
			});
	});
});
describe("GET /api/articles", () => {
	it("status 200: responds with an articles array of article objects", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(body["articles"].length).toBe(12);
				body["articles"].forEach((topic) => {
					expect(topic).toEqual({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String),
					});
				});
			});
	});
	it("status 200: responds with an articles array of article objects while accepting a sort_by query which defaults to date", () => {
		const sort_by = "author";
		return request(app)
			.get(`/api/articles?sort_by=${sort_by}`)
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy(`${sort_by}`, { descending: true });
			});
	});
	it("status 200: responds with an articles array of article objects while accepting an order query which defaults to descending", () => {
		const sort_by = "topic";
		const order = "asc";
		return request(app)
			.get(`/api/articles?sort_by=${sort_by}&order=${order}`)
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy(`${sort_by}`, { descending: false });
			});
	});
	it("status 200: responds with an articles array of article objects while accepting a topic query which filters the articles", () => {
		const sort_by = "article_id";
		const order = "asc";
		const topic = "mitch";
		return request(app)
			.get(`/api/articles?sort_by=${sort_by}&order=${order}&topic=${topic}`)
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(11);
				expect(body.articles).toBeSortedBy(`${sort_by}`, { descending: false });
			});
	});
	it("status 400: responds with an error message if sort_by query is an invalid data type or does not reference a valid column", () => {
		const sort_by = 3;
		return request(app)
			.get(`/api/articles?sort_by=${sort_by}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid sort_by query");
			});
	});
	it("status 400: responds with an error message if order query is neither 'asc' or 'desc'", () => {
		const order = 2;
		return request(app)
			.get(`/api/articles?order=${order}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid order query");
			});
	});
	it("status 400: responds with an error message if topic filter query is invalid data type", () => {
		const topic = 4;
		return request(app)
			.get(`/api/articles?topic=${topic}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid topic");
			});
	});
});

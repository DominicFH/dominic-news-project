const db = require("../db/index.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const { sort, forEach } = require("../db/data/test-data/articles.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
	describe("GET", () => {
		describe("SUCCESS", () => {
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
		});
		describe("ERRORS", () => {
			it("status 404: responds with error message if url entered incorrectly", () => {
				return request(app)
					.get("/api/catpics")
					.expect(404)
					.then(({ body }) => {
						expect(body.message).toBe("Invalid path");
					});
			});
		});
	});
	describe("NO METHOD", () => {
		it("status 405: responds with error message if making a forbidden request", () => {
			return request(app)
				.delete("/api/topics")
				.expect(405)
				.then(({ body }) => {
					expect(body.message).toBe("Method not available");
				});
		});
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
		describe("SUCCESS", () => {
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
		});
		describe("ERRORS", () => {
			it("status 404: responds with error message if article id is not in the database ", () => {
				const article_id = 99;
				return request(app)
					.get(`/api/articles/${article_id}`)
					.expect(404)
					.then(({ body }) => {
						expect(body.message).toBe("No article with that id");
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
	});
	describe("PATCH", () => {
		describe("SUCCESS", () => {
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
		});
		describe("ERRORS", () => {
			it("status 404: responds with error message if article is is not in the database", () => {
				const incVotesObj = { inc_votes: 3 };
				const article_id = 99;
				return request(app)
					.patch(`/api/articles/${article_id}`)
					.send(incVotesObj)
					.expect(404)
					.then(({ body }) => {
						expect(body.message).toBe("No article with that id");
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
	});
	describe("NO METHOD", () => {
		it("status 405: responds with error message if making a forbidden request", () => {
			const article_id = 1;
			return request(app)
				.delete(`/api/articles/${article_id}`)
				.expect(405)
				.then(({ body }) => {
					expect(body.message).toBe("Method not available");
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET", () => {
		describe("SUCCESS", () => {
			it("status 200: responds with an articles array of article objects", () => {
				return request(app)
					.get("/api/articles")
					.expect(200)
					.then(({ body }) => {
						expect(body["articles"].length).toBe(12);
						body["articles"].forEach((topic) => {
							expect(topic).toMatchObject({
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
						expect(body.articles).toBeSortedBy(`${sort_by}`, {
							descending: true,
						});
					});
			});
			it("status 200: responds with an articles array of article objects while accepting an order query which defaults to descending", () => {
				const sort_by = "topic";
				const order = "asc";
				return request(app)
					.get(`/api/articles?sort_by=${sort_by}&order=${order}`)
					.expect(200)
					.then(({ body }) => {
						expect(body.articles).toBeSortedBy(`${sort_by}`, {
							descending: false,
						});
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
						expect(body.articles).toBeSortedBy(`${sort_by}`, {
							descending: false,
						});
					});
			});
		});
		describe("ERRORS", () => {
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
			it("status 404: responds with an error message if topic filter query is provided but topic does not exist", () => {
				const topic = "4";
				return request(app)
					.get(`/api/articles?topic=${topic}`)
					.expect(404)
					.then(({ body }) => {
						expect(body.message).toBe("Topic not found");
					});
			});
			it("status 404: responds with an error message if request and any queries are valid but no articles found", () => {
				const sort_by = "title";
				const topic = "paper";
				return request(app)
					.get(`/api/articles?sort_by=${sort_by}&topic=${topic}`)
					.expect(404)
					.then(({ body }) => {
						expect(body.message).toBe("No articles found");
					});
			});
		});
	});
	describe("NO METHOD", () => {
		it("status 405: responds with error message if making a forbidden request", () => {
			return request(app)
				.delete("/api/articles")
				.expect(405)
				.then(({ body }) => {
					expect(body.message).toBe("Method not available");
				});
		});
	});
});

describe("/api/articles/:article_id/comments", () => {
	describe("GET", () => {
		describe("SUCCESS", () => {
			it("status 200: responds with a comments array of comment objects for the provided article id", () => {
				const article_id = 1;
				return request(app)
					.get(`/api/articles/${article_id}/comments`)
					.expect(200)
					.then(({ body }) => {
						expect(body["comments"].length).toBe(11);
						body["comments"].forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.any(Number),
								votes: expect.any(Number),
								created_at: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
							});
						});
					});
			});
		});
		describe("ERRORS", () => {
			it("status 404: responds with an error message if article id is not in the database", () => {
				const article_id = 999;
				return request(app)
					.get(`/api/articles/${article_id}/comments`)
					.expect(404)
					.then(({ body }) => {
						expect(body.message).toBe("No article with that id");
					});
			});
		});
	});
	describe("NO METHOD", () => {
		it("status 405: responds with error message if making a forbidden request", () => {
			return request(app)
				.delete("/api/topics")
				.expect(405)
				.then(({ body }) => {
					expect(body.message).toBe("Method not available");
				});
		});
	});
});

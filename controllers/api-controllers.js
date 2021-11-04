exports.getApi = (req, res, next) => {
	console.log("Inside controller");
	res.status(200).send({
		"GET /api": {
			description:
				"serves up a json representation of all the available endpoints of the api",
		},
		"GET /api/topics": {
			description: "serves an array of all topics",
			exampleResponse: {
				topics: [{ slug: "football", description: "Footie!" }],
			},
		},
		"GET /api/articles/:article_id": {
			description:
				"serves an array containing a single object of the requested article object ",
			exampleResponse: {
				article: [
					{
						article_id: 1,
						title: "Creating an app",
						body: "This is how to create an app",
						votes: 0,
						topic: "coding",
						author: "mrsmith",
						created_at: "2020-11-07T06:03:00.000Z",
						comment_count: "4",
					},
				],
			},
		},
		"PATCH /api/articles/:article_id": {
			description:
				"updates the votes property of the requested article, serves an array containing the updated article object",
			exampleRequest: { inc_votes: 2 },
			exampleResponse: {
				article: [
					{
						article_id: 1,
						title: "Creating an app",
						body: "This is how to create an app",
						votes: 0,
						topic: "coding",
						author: "mrsmith",
						created_at: "2020-11-07T06:03:00.000Z",
						comment_count: "6",
					},
				],
			},
		},
		"GET /api/articles": {
			description:
				"serves an array of all topics, accepts queries to sort or filter the response",
			queries: ["topic", "sort_by", "order"],
			exampleResponse: {
				articles: [
					{
						author: "mistersmith",
						title: "Seafood substitutions are increasing",
						article_id: 31,
						topic: "cooking",
						author: "weegembump",
						created_at: "020-03-11T21:16:00.000Z",
						votes: 0,
						comment_count: "2",
					},
				],
			},
		},
		"GET /api/articles/:article_id/comments": {
			description:
				"serves an array containing all the comment objects for the requested article",
			exampleResponse: {
				comments: [
					{
						comment_id: 12,
						votes: 4,
						created_at: "2020-09-26T17:16:00.000Z",
						author: "mrSmith",
						body: "I don't like this article",
					},
				],
			},
		},
		"POST /api/articles/:article_id/comments": {
			description:
				"adds a new comment for the requested article, serves an array containing the new comment object",
			exampleRequest: { username: "icellusedkars", body: "test comment" },
			exampleResponse: {
				comment: [
					{
						article_id: 12,
						votes: 4,
						created_at: "2020-09-26T17:16:00.000Z",
						author: "mrSmith",
						body: "I don't like this article",
					},
				],
			},
		},
		"DELETE /api/comments/:comment_id": {
			description: "deletes the request comment from the database",
		},
	});
};

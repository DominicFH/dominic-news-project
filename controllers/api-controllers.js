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
		"GET /api/articles": {
			description: "serves an array of all topics",
			queries: ["topic", "sort_by", "order"],
			exampleResponse: {
				articles: [
					{
						author: "mistersmith",
						title: "Seafood substitutions are increasing",
						article_id: 31,
						topic: "cooking",
						author: "weegembump",
						created_at: 1527695953341,
						votes: 0,
						comment_count: "2",
					},
				],
			},
		},
	});
};

const db = require("../db");
const { validateQueryOutput, validateReqBody } = require("../utils");

exports.fetchArticleById = (articleId) => {
	return db
		.query(
			`SELECT 
			articles.author, 
			title, 
			articles.article_id, 
            articles.body, 
			topic, 
			articles.created_at, 
			articles.votes,
            COUNT(comments.article_id) AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY 
			articles.author, 
			articles.title, 
			articles.article_id,
            articles.body, 
			articles.topic;`,
			[articleId]
		)
		.then(({ rows }) => {
			return validateQueryOutput(rows);
		});
};

exports.updateArticleById = (articleId, incVotes) => {
	return db
		.query(
			`
		UPDATE articles
		SET votes = votes + $1
		WHERE article_id = $2
		RETURNING *;`,
			[incVotes, articleId]
		)
		.then(({ rows }) => {
			return validateQueryOutput(rows);
		})
		.then((outputData) => {
			return validateReqBody(outputData, incVotes);
		});
};

exports.fetchAllArticles = (sortBy = "created_at") => {
	console.log(sortBy);

	if (
		!["author", "title", "article_id", "topic", "created_at", "votes"].includes(
			sortBy
		)
	) {
		return Promise.reject({ status: 400, message: "Invalid sort_by query" });
	}

	return db
		.query(
			`SELECT 
			articles.author, 
			title, 
			articles.article_id, 
			topic, 
			articles.created_at, 
			articles.votes,
			COUNT(comments.article_id) AS comment_count
			FROM articles
			LEFT JOIN comments
			ON articles.article_id = comments.article_id
			GROUP BY 
			articles.author, 
			articles.title,
			articles.article_id,
			articles.body, 
			articles.topic
			ORDER BY ${sortBy};`
		)
		.then(({ rows }) => {
			return rows;
		});
};

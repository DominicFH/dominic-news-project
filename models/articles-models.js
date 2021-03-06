const db = require("../db");
const { validateQueryOutput } = require("../utils");

exports.fetchArticleById = (articleId) => {
	return db
		.query(
			`SELECT 
			articles.*,
            COUNT(comments.comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY 
			articles.article_id;`,
			[articleId]
		)
		.then(({ rows }) => {
			return validateQueryOutput(rows);
		});
};

exports.updateArticleById = (articleId, incVotes) => {
	if (!incVotes) {
		return Promise.reject({
			status: 400,
			message: "Invalid input",
		});
	} else {
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
			});
	}
};

exports.fetchAllArticles = (sortBy = "created_at", order = "desc", topic) => {
	// Error handling for sort_by
	// prettier-ignore
	if (!["author", "title", "article_id", "topic", "created_at", "votes"].includes(sortBy)) {
		return Promise.reject({ status: 400, message: "Invalid sort_by query" });
	}

	// Error handling for order
	if (!["asc", "desc"].includes(order)) {
		return Promise.reject({ status: 400, message: "Invalid order query" });
	}

	let queryString = `
		SELECT 
		articles.*,
		COUNT(comments.comment_id) AS comment_count
		FROM articles
		LEFT JOIN comments
		ON articles.article_id = comments.article_id`;

	// Implementing topic filter and also error handling
	// prettier-ignore
	if (["mitch", "cats", "paper", "coding", "football", "cooking"].includes(topic)) {
		queryString += ` WHERE topic = '${topic}'`;
	} else if (topic !== undefined) {
		return Promise.reject({ status: 404, message: "Topic not found"})
	}

	queryString += `
		GROUP BY articles.article_id
		ORDER BY ${sortBy} ${order}`;

	return db.query(queryString).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, message: "No articles found" });
		} else {
			return rows;
		}
	});
};

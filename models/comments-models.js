const db = require("../db");
const { validateQueryOutput } = require("../utils");

exports.fetchCommentsByArticleId = (articleId) => {
	return db
		.query(
			`SELECT
            comment_id,
            votes,
            created_at,
            author,
            body
            FROM comments
            WHERE article_id = $1;`,
			[articleId]
		)
		.then(({ rows }) => {
			return validateQueryOutput(rows);
		});
};

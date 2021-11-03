const db = require("../db");

exports.fetchCommentsByArticleId = (articleId) => {
	console.log("inside model");
	console.log(articleId);
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
			return rows;
		});
};

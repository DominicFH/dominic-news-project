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

exports.insertCommentByArticleId = (articleId, newComment) => {
	const { username, body } = newComment;

	if (!username || !body) {
		return Promise.reject({ status: 400, message: "Invalid input" });
	}

	if (
		![
			"tickle122",
			"grumpy19",
			"happyamy2016",
			"cooljmessy",
			"weegembump",
			"jessjelly",
			"butter_bridge",
			"icellusedkars",
			"rogersop",
			"lurker",
		].includes(username)
	) {
		return Promise.reject({ status: 404, message: "User does not exist" });
	}

	return db
		.query(
			`INSERT INTO comments (author, article_id, body)
			VALUES ($1, $2, $3)
			RETURNING *;`,
			[username, articleId, body]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.removeCommentById = (commentId) => {
	return db
		.query(
			`
			DELETE FROM comments
			WHERE comment_id = $1;`,
			[commentId]
		)
		.then((deleteConf) => {
			const { rowCount } = deleteConf;
			if (rowCount === 0) {
				return Promise.reject({
					status: 404,
					message: "No comment found to delete",
				});
			} else return;
		});
};

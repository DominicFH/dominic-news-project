const db = require("../db");

exports.fetchArticleById = (articleId) => {
	return db
		.query(
			`SELECT articles.author, title, articles.article_id, 
            articles.body, topic, articles.created_at, articles.votes,
            COUNT(comments.article_id) AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.author, articles.title, articles.article_id,
            articles.body, articles.topic;`,
			[articleId]
		)
		.then(({ rows }) => {
			const article = rows;
			if (!article[0]) {
				return Promise.reject({
					status: 404,
					message: "No article found",
				});
			}
			return rows;
		});
};

const db = require("../db");

exports.fetchArticleById = (articleId) => {
	return db
		.query(
			`SELECT articles.author, title, articles.article_id, 
        articles.body, topic, articles.created_at, articles.votes,
        COUNT(comments.article_id) AS comment_count
        FROM articles
        INNER JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.author, articles.title, articles.article_id,
        articles.body, articles.topic;`,
			[articleId]
		)
		.then(({ rows }) => {
			return rows;
		});
};

// author which is the username from the users table
// title
// article_id
// body
// topic
// created_at
// votes
// comment_count which is the total count of all the comments with this
// article_id - you should make use of queries to the database in order to
// achieve this

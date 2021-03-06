const { extractData } = require("../../utils");
const db = require("../index");
const format = require("pg-format");

//prettier-ignore
const seed = (data) => {
	const { articleData, commentData, topicData, userData } = data;
	return (
		db
			// Dropping existing tables for each run of seed
			.query(`DROP TABLE IF EXISTS comments;`)
			.then(() => {
				return db.query(`DROP TABLE IF EXISTS articles;`);
			})
			.then(() => {
				return db.query(`DROP TABLE IF EXISTS users;`);
			})
			.then(() => {
				return db.query(`DROP TABLE IF EXISTS topics;`);
			})
			// Creating tables, order based on referencing
			// CREATE topics
			.then(() => {
				return db.query(`
					CREATE TABLE topics (
					slug VARCHAR PRIMARY KEY,
					description TEXT NOT NULL
					);`
				);
			})
			// CREATE users
			.then(() => {
				return db.query(`
					CREATE TABLE users (
					username VARCHAR (20) PRIMARY KEY,
					avatar_url TEXT,
					name VARCHAR (30)
					);`
				);
			})
			// CREATE articles
			.then(() => {
				return db.query(`
					CREATE TABLE articles (
					article_id SERIAL PRIMARY KEY,
					title VARCHAR (100) NOT NULL,
					body TEXT NOT NULL,
					votes INT DEFAULT 0,
					topic VARCHAR references topics(slug),
					author VARCHAR (20) references users(username),
					created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
					);`
				);
			})
			// CREATE comments
			.then(() => {
				return db.query(`
					CREATE TABLE comments (
					comment_id SERIAL PRIMARY KEY,
					author VARCHAR (20) references users(username),
					article_id INT references articles(article_id) ON DELETE CASCADE,
					votes INT DEFAULT 0,
					created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
					body TEXT NOT NULL
					);`
				);
			})
			// Inserting into tables
			// INSERT INTO topics
			.then(() => {
				// Take the topic data and format it to be used in insert query
				const topicsValues = extractData(topicData, ['slug', 'description']);
				const insertQuery = format(
					`INSERT INTO topics (slug, description)
					VALUES
					%L;`,
					topicsValues
				);
				return db.query(insertQuery);
			})
			// INSERT INTO users
			.then(() => {
				const userValues = extractData(userData, [
					'username',
					'avatar_url',
					'name',
				]);
				const insertQuery = format(
					`INSERT INTO users (username, avatar_url, name)
					VALUES
					%L;`,
					userValues
				);
				return db.query(insertQuery);
			})
			// INSERT INTO articles
			.then(() => {
				const articleValues = extractData(articleData, [
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at',
				]);
				const insertQuery = format(
					`INSERT INTO articles (title, body, votes, topic, author, created_at)
					VALUES
					%L;`,
					articleValues
				);
				return db.query(insertQuery);
			})
			// INSERT INTO comments
			.then(() => {
				const commentValues = extractData(commentData, [
					'author',
					'article_id',
					'votes',
					'created_at',
					'body',
				]);
				const insertQuery = format(
					`INSERT INTO comments (author, article_id, votes, created_at, body)
					VALUES
					%L;`,
					commentValues
				);
				return db.query(insertQuery);
			})
	);
};

module.exports = seed;

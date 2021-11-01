const { extractData } = require("../../utils");
const db = require("../index");
const format = require("pg-format");

const seed = (data) => {
	const { articleData, commentData, topicData, userData } = data;
	// Drop tables if exist, order based on referencing
	return (
		db
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
			// Create tables, order based on referencing
			// CREATE topics
			.then(() => {
				return db.query(`
          CREATE TABLE topics (
          slug VARCHAR NOT NULL UNIQUE PRIMARY KEY,
          description TEXT NOT NULL
          );`);
			})
			// CREATE users
			.then(() => {
				return db.query(`
          CREATE TABLE users (
          username VARCHAR (20) NOT NULL UNIQUE PRIMARY KEY,
          avatar_url TEXT,
          name VARCHAR (30)
          );`);
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
          );`);
			})
			// CREATE comments
			.then(() => {
				return db.query(`
          CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR (20) references users(username),
          article_id INT references articles(article_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          body TEXT NOT NULL
          );`);
			})
			// Inserting into tables
			// INSERT INTO topics
			.then(() => {
				// Take the topic data and format it to be used in insert query
				const topicsValues = extractData(topicData, ["slug", "description"]);
				const insertQuery = format(
					`INSERT INTO topics (slug, description)
          VALUES
          %L RETURNING *;`,
					topicsValues
				);
				return db.query(insertQuery);
			})
			// INSERT INTO users
			.then(() => {
				const userValues = extractData(userData, [
					"username",
					"avatar_url",
					"name",
				]);
				const insertQuery = format(
					`INSERT INTO users (username, avatar_url, name)
          VALUES
          %L RETURNING *;`,
					userValues
				);
				return db.query(insertQuery);
			})
			// INSERT INTO articles
			.then(() => {
				const articleValues = extractData(articleData, [
					"title",
					"body",
					"votes",
					"topic",
					"author",
					"created_at",
				]);
				const insertQuery = format(
					`INSERT INTO articles (title, body, votes, topic, author, created_at)
          VALUES
          %L RETURNING *;`,
					articleValues
				);
				return db.query(insertQuery);
			})
	);
};

module.exports = seed;

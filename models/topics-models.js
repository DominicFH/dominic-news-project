const db = require("../db");

exports.fetchAllTopics = () => {
	return db
		.query(
			`
            SELECT slug, description
            FROM topics;`
		)
		.then(({ rows }) => {
			return rows;
		});
};

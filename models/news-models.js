const db = require("../db/connection");

exports.fetchTopics = (query) => {
	let databaseQuery = `SELECT slug, description 
    FROM topics`;
	return db.query(databaseQuery).then(({ rows }) => {
		return rows;
	});
};

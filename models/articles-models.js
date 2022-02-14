const db = require("../db/connection");

exports.fetchArticles = () => {
	let databaseQuery = `SELECT * FROM articles`;
	return db.query(databaseQuery).then(({ rows }) => {
		return rows;
	});
};

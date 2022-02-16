const db = require("../db/connection");

exports.fetchUsers = (query) => {
	let databaseQuery = `SELECT username FROM users;`;
	return db.query(databaseQuery).then(({ rows }) => {
		return rows;
	});
};

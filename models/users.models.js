const db = require("../db/connection");

exports.fetchUsers = () => {
	let databaseQuery = `SELECT username FROM users;`;
	return db.query(databaseQuery).then(({ rows }) => {
		return rows;
	});
};

exports.fetchUserByUsername = (username) => {
	return db
		.query(
			`SELECT * 
			FROM users
			WHERE users.username = $1;`,
			[username]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "This username does not exist",
				});
			} else {
				user = rows[0];
				return { user: user };
			}
		});
};

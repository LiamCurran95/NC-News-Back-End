const db = require("../db/connection");

exports.checkArticleExists = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Valid ID format, article does not exist",
				});
			} else {
				return rows[0];
			}
		});
};

exports.fetchArticlesById = (id) => {
	return db
		.query(
			`SELECT username, title, article_id, body, topic, created_at, votes 
    FROM articles
    JOIN users
    ON users.username = articles.author
    WHERE article_id = $1;`,
			[id]
		)
		.then(({ rows }) => {
			console.log(rows);
			return rows;
		});
};

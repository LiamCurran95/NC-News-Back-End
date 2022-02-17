const db = require("../db/connection");

exports.checkArticleExists = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Valid ID format, this article does not exist.",
				});
			} else {
				return rows[0];
			}
		});
};

exports.checkCommentsExist = (id) => {
	return db
		.query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Valid ID format, this article has no comments.",
				});
			} else {
				return rows[0];
			}
		});
};

exports.fetchArticles = () => {
	return db
		.query(
			`SELECT COUNT (comment_id) AS comment_count, articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes
    		FROM articles
			LEFT JOIN comments
			ON comments.article_id = articles.article_id
			GROUP BY articles.article_id 
			ORDER BY created_at DESC;`
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.fetchArticlesById = (id) => {
	return db
		.query(
			`SELECT 
			COUNT(comment_id)
			AS comment_count, articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes
			FROM articles
			JOIN comments
			ON comments.article_id = articles.article_id
			WHERE articles.article_id = $1
			GROUP BY articles.article_id;`,
			[id]
		)
		.then(({ rows: [article] }) => {
			return article;
		});
};

exports.updateArticleById = ({ inc_votes }, article_id) => {
	return db
		.query(
			`UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;`,
			[inc_votes, article_id]
		)
		.then(({ rows }) => {
			if (rows.length === 0)
				return Promise.reject({
					status: 404,
					msg: "Path not found.",
				});
			return rows[0];
		});
};

const db = require("../db/connection");

exports.fetchArticles = () => {
	return db
		.query(
			`SELECT username, title, article_id, body, topic, created_at, votes 
    FROM articles
    JOIN users
    ON users.username = articles.author
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
			LEFT JOIN comments
			ON comments.article_id = articles.article_id
			WHERE articles.article_id = $1
			GROUP BY articles.article_id;`,
			[+id]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "This article_id does not exist.",
				});
			} else {
				return rows;
			}
		});
};

exports.fetchCommentsByArticleId = (id) => {
	return db
		.query(
			`SELECT comment_id, votes, created_at, author, body, article_id
		FROM comments
		WHERE article_id = $1;`,
			[id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.updateArticleById = ({ inc_votes }, article_id) => {
	return db
		.query(
			`UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;`,
			[+inc_votes, +article_id]
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

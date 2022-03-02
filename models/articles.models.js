const db = require("../db/connection");

exports.fetchArticles = (sortBy, order, topic) => {
	const validSortOptions = [
		"author",
		"title",
		"article_id",
		"topic",
		"votes",
		"comment_count",
		"date",
	];
	if (sortBy && !validSortOptions.includes(sortBy))
		return Promise.reject({ status: 400, msg: "Invalid sort_by" });

	if (!sortBy || sortBy === "date") sortBy = "created_at";

	if (order && !["asc", "desc"].includes(order))
		return Promise.reject({
			status: 400,
			msg: "Invalid - 'ASC' or 'DESC' only",
		});

	order = order === "asc" ? "ASC" : "DESC";

	let queryStr = `
	  SELECT articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.author, COUNT(comments.comment_id)::INT AS comment_count
	  FROM articles
	  LEFT JOIN comments ON articles.article_id = comments.article_id `;

	let prepValues = [];
	if (topic) {
		queryStr += `WHERE topic LIKE $1 `;
		prepValues.push(`${topic}`);
	}

	queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order}`;

	return db.query(queryStr, prepValues).then(({ rows: articles }) => {
		if (!articles.length) {
			return Promise.reject({
				status: 404,
				msg: "No articles found with that topic",
			});
		}
		return [articles];
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
			return { article_comments: rows };
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

exports.addComment = ({ author, body }, article_id) => {
	const commentProperties = [author, body, article_id];
	return db
		.query(
			`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
			commentProperties
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

const db = require("../db/connection");

exports.deleteCommentById = (commentId) => {
	return db
		.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
			commentId,
		])
		.then(({ rows: [comment] }) => {
			if (!comment) {
				return Promise.reject({
					status: 404,
					msg: "No comment found for this ID.",
				});
			} else {
				return comment;
			}
		});
};

exports.updateCommentVotesById = ({ comment_id }, { inc_votes }) => {
	return db
		.query(
			`UPDATE comments SET votes = (votes + $1) WHERE comment_id = $2 RETURNING *;`,
			[+inc_votes, +comment_id]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Comment not found.",
				});
			} else {
				return rows[0];
			}
		});
};

const db = require("../db/connection");

exports.deleteCommentById = (commentId) => {
	return db
		.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
			commentId,
		])
		.then(({ rows: [comment] }) => {
			if (!comment)
				return Promise.reject({
					status: 404,
					msg: "No comment found for this ID.",
				});
			return comment;
		});
};

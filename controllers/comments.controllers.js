const { deleteCommentById } = require("../models/comments.models");

exports.removeCommentById = (req, res, next) => {
	const { comment_id: commentId } = req.params;
	return deleteCommentById(commentId)
		.then(() => {
			return res.status(204).send();
		})
		.catch(next);
};

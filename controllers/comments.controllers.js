const {
	deleteCommentById,
	updateCommentVotesById,
} = require("../models/comments.models");

exports.removeCommentById = (req, res, next) => {
	const { comment_id: commentId } = req.params;
	return deleteCommentById(commentId)
		.then(() => {
			return res.status(204).send();
		})
		.catch(next);
};

exports.patchCommentVote = (req, res, next) => {
	const comment_id = req.params;
	const inc_votes = req.body;
	updateCommentVotesById(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

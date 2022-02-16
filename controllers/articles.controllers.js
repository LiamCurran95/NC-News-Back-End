const {
	fetchArticlesById,
	checkArticleExists,
} = require("../models/articles.models");

exports.getArticlesById = (req, res, next) => {
	const { article_id } = req.params;
	Promise.all([fetchArticlesById(article_id), checkArticleExists(article_id)])
		.then(([article]) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

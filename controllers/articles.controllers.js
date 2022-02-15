const {
	fetchArticlesById,
	checkArticleExists,
	fetchArticles,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
	fetchArticles(req.query)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

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

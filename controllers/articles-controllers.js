const { fetchArticles } = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
	fetchArticles(req.query)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

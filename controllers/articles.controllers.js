const {
	fetchArticlesById,
	checkArticleExists,
	fetchArticles,
	updateArticleById,
	checkCommentsExist,
	fetchArticleCommentsById,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
	fetchArticles(req.query)
		.then((articles) => {
			res.status(200).send({ articles: articles });
		})
		.catch(next);
};

exports.getArticlesById = (req, res, next) => {
	const { article_id } = req.params;
	Promise.all([
		fetchArticlesById(article_id),
		checkArticleExists(article_id),
		checkCommentsExist(article_id),
	])
		.then(([article]) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticleCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	Promise.all([
		fetchArticleCommentsById(article_id),
		checkArticleExists(article_id),
		checkCommentsExist(article_id),
	])
		// .then(([resolvedarray]) => {
		// 	console.log(resolvedarray);
		// })
		//ARRAY DESTRUCTURE GIVES YOU FIRST INDEX I.E. FETCHARTICLECOMMENTSBYID
		.then(([comments]) => {
			// console.log(comments);
			res.status(200).send(comments);
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchArticle = (req, res, next) => {
	updateArticleById(req.body, req.params.article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

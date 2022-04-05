const {
	fetchArticlesById,
	fetchArticles,
	updateArticleById,
	fetchCommentsByArticleId,
	addComment,
	addArticle,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
	const { sort_by: sortBy, order, topic } = req.query;
	fetchArticles(sortBy, order, topic)
		.then(([article]) => {
			res.status(200).send({ articles: article });
		})
		.catch(next);
};

exports.getArticlesById = (req, res, next) => {
	const { article_id } = req.params;
	fetchArticlesById(article_id)
		.then(([article]) => {
			res.status(200).send({ article: article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	fetchCommentsByArticleId(article_id)
		.then((comments) => {
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

exports.postComment = (req, res, next) => {
	addComment(req.body, req.params.article_id)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.postArticle = (req, res, next) => {
	addArticle(req.body)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};

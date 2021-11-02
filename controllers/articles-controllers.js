const {
	fetchArticleById,
	updateArticleById,
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	fetchArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchArticleById = (req, res, next) => {
	const { inc_votes } = req.body;
	const { article_id } = req.params;
	updateArticleById(article_id, inc_votes)
		.then((updated_article) => {
			res.status(200).send({ updated_article });
		})
		.catch((err) => {
			next(err);
		});
};

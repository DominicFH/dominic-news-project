const {
	fetchCommentsByArticleId,
	insertCommentByArticleId,
	removeCommentById,
} = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	fetchCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
	const newComment = req.body;
	const { article_id } = req.params;

	insertCommentByArticleId(article_id, newComment)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};

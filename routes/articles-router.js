const articlesRouter = require("express").Router();
const { forbiddenMethod } = require("../utils");
const {
	getArticleById,
	patchArticleById,
	getAllArticles,
} = require("../controllers/articles-controllers");
const {
	getCommentsByArticleId,
} = require("../controllers/comments-controllers");

articlesRouter.route("/").get(getAllArticles).all(forbiddenMethod);

articlesRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(patchArticleById)
	.all(forbiddenMethod);

articlesRouter
	.route("/:article_id/comments")
	.get(getCommentsByArticleId)
	.all(forbiddenMethod);

module.exports = articlesRouter;

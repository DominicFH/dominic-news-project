const articlesRouter = require("express").Router();
const { forbiddenMethod } = require("../utils");
const {
	getArticleById,
	patchArticleById,
	getAllArticles,
} = require("../controllers/articles-controllers");

articlesRouter.route("/").get(getAllArticles).all(forbiddenMethod);

articlesRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(patchArticleById)
	.all(forbiddenMethod);

articlesRouter.route("/:article_id/comments").all(forbiddenMethod);

module.exports = articlesRouter;

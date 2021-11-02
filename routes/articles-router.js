const articlesRouter = require("express").Router();
const {
	getArticleById,
	patchArticleById,
	getAllArticles,
} = require("../controllers/articles-controllers");

articlesRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(patchArticleById);

articlesRouter.route("/").get(getAllArticles);

module.exports = articlesRouter;

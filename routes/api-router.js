const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const { getApi } = require("../controllers/api-controllers");
const { forbiddenMethod } = require("../utils");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.route("/").get(getApi).all(forbiddenMethod);

module.exports = apiRouter;

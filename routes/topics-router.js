const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics-controllers");
const { forbiddenMethod } = require("../utils");

topicsRouter.route("/").get(getAllTopics).all(forbiddenMethod);

module.exports = topicsRouter;

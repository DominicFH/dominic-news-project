const commentsRouter = require("express").Router();
const { forbiddenMethod } = require("../utils");
const { deleteCommentById } = require("../controllers/comments-controllers");

commentsRouter
	.route("/:comment_id")
	.delete(deleteCommentById)
	.all(forbiddenMethod);

module.exports = commentsRouter;

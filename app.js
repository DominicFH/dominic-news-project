const express = require("express");
const apiRouter = require("./routes/api-router");
const {
	handleCustomError,
	handleServerError,
	handle400Error,
	handle404Error,
} = require("./errors/errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
	res.status(404).send({ message: "Invalid path" });
});

app.use(handleCustomError);
app.use(handle400Error);
app.use(handle404Error);
app.use(handleServerError);

module.exports = app;

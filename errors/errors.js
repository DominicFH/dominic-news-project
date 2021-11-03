exports.handleCustomError = (err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ message: err.message });
	} else next(err);
};

exports.handle400Error = (err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ message: "Invalid ID type" });
	} else if (err.code === "23502") {
		res.status(400).send({ message: "Invalid input" });
	} else next(err);
};

exports.handle404Error = (err, req, res, next) => {
	if (err.code === "23503") {
		res.status(404).send({ message: "Requested ID not found" });
	} else next(err);
};

exports.handleServerError = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ message: "Internal server error" });
};

exports.handleCustomError = (err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ message: err.message });
	} else next(err);
};

exports.handleServerError = (err, req, res, next) => {
	console.log(err.code);
	res.status(500).send({ message: "Internal server error" });
};

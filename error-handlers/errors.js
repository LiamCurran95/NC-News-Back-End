exports.psqlErrorHandler = (err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad request." });
	} else if (err.code === "23502") {
		res.status(400).send({ msg: "Further information required in body." });
	} else if (err.code === "23503") {
		res.status(400).send({ msg: "Bad request." });
	} else {
		next(err);
	}
};

exports.customErrorHandler = (err, req, res, next) => {
	const { status, msg } = err;
	if (status) {
		res.status(status).send({ msg });
	} else {
		next(err);
	}
};

exports.error500Handler = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "There is an error on the server" });
};

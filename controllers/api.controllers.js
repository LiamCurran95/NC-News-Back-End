exports.getEndpoints = (_, res, next) => {
	res.status(200).send({
		"GET /api": {
			description:
				"Responds with a JSON object detailing the available endpoints",
		},
	});
};

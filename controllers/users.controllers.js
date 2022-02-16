const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
	fetchUsers(req.query)
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

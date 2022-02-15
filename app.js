const express = require("express");
const {
	getArticlesById,
	getArticles,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/news.controllers");
const errors = require("./controllers/errors");
const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

//TOPICS
app.get("/api/topics", getTopics);

//ARTICLES
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);

//USERS
app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Path not found within the server." });
});

app.use(errors.PsqlErrorHandler);
app.use(errors.customErrorHandler);
app.use(errors.error500Handler);

module.exports = app;

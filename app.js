const express = require("express");
const { getArticles } = require("./controllers/articles-controllers");
const { getTopics } = require("./controllers/news-controllers");

const app = express();

app.use(express.json());

//TOPICS
app.get("/api/topics", getTopics);

//ARTICLES
app.get("/api/articles", getArticles);

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Path not found within the server." });
});

module.exports = app;

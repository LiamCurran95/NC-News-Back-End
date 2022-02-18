const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));
afterAll(() => {
	if (db.end) db.end();
});

describe("/api/topics endpoint", () => {
	describe("GET /api/topics", () => {
		test("Status 200 - Body contains an object containing an array of topics", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then((res) => {
					expect(res.body.topics).toHaveLength(3);
					res.body.topics.forEach((topic) => {
						expect(topic).toMatchObject({
							slug: expect.any(String),
							description: expect.any(String),
						});
					});
				});
		});
		test("Status 404 - Path not found", () => {
			return request(app)
				.get("/api/topic")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});
	});
});

describe("/api/articles endpoint", () => {
	describe("GET /api/articles", () => {
		test("Status 200 - Body contains an object containing an array of topics", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles[0]["created_at"]).toBe(
						"2020-11-03T09:12:00.000Z"
					);
					expect(body.articles[1]["created_at"]).toBe(
						"2020-10-18T01:00:00.000Z"
					);
					expect(body.articles[11]["created_at"]).toBe(
						"2020-01-07T14:08:00.000Z"
					);
					expect(body.articles).toHaveLength(12);
					body.articles.forEach((article) => {
						expect(article).toMatchObject({
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							username: expect.any(String),
						});
					});
				});
		});
		test("Status 404 - Path not found", () => {
			return request(app)
				.get("/api/artic")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});
	});

	describe("GET /api/:article_id", () => {
		test("Status 200 - Body contains an object with the relevant article", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(200)
				.then(({ body }) => {
					expect(body).toEqual({
						article: {
							comment_count: "11",
							author: "butter_bridge",
							title: "Living in the shadow of a great man",
							article_id: 1,
							body: "I find this existence challenging",
							topic: "mitch",
							created_at: "2020-07-09T20:11:00.000Z",
							votes: 100,
						},
					});
				});
		});
		test("Status 200 - Valid ID - Article has no comments ", () => {
			const article_id = 2;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(200)
				.then(({ body }) => {
					expect(body.article.comment_count).toBe("0");
				});
		});
		test("Status 400 - Invalid ID", () => {
			return request(app)
				.get(`/api/articles/notAnId`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request.");
				});
		});
		test("Status 404 - Valid ID - Article doesn't exist within database.", () => {
			return request(app)
				.get(`/api/articles/234`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("This article_id does not exist.");
				});
		});
		test("Status 404 - Invalid ID - path not found", () => {
			return request(app)
				.get("/api/articl/123")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});

		test("Status 404 - Valid ID - Article has no comments (comment_count)", () => {
			const article_id = 2;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("This article has no comments.");
				});
		});
	});

	describe("GET /api/articles/:article_id/comments", () => {
		test("Status 200 - Return body contains an array of comments with respective properties, for an article with a single comment", () => {
			const article_id = 6;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.then(({ body }) => {
					expect(body).toEqual([
						{
							comment_id: 16,
							votes: 1,
							created_at: "2020-10-11T15:23:00.000Z",
							author: "butter_bridge",
							body: "This is a bad article name",
							article_id: 6,
						},
					]);
				});
		});
		test("Status 200 - Return body contains an array of comments with respective properties, for an article with a multiple comments", () => {
			const article_id = 9;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.then(({ body }) => {
					expect(body).toEqual([
						{
							comment_id: 1,
							votes: 16,
							created_at: "2020-04-06T12:17:00.000Z",
							author: "butter_bridge",
							body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
							article_id: 9,
						},
						{
							comment_id: 17,
							body: "The owls are not what they seem.",
							votes: 20,
							author: "icellusedkars",
							article_id: 9,
							created_at: "2020-03-14T17:02:00.000Z",
						},
					]);
				});
		});
		test("Status 200 - Valid ID - Article has no comments (comment_count)", () => {
			const article_id = 2;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("This article has no comments.");
				});
		});
		test("Status 404 - Invalid ID - path not found", () => {
			const article_id = 9;
			return request(app)
				.get(`/api/articles/${article_id}/comment`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});

	});

	describe("PATCH /api/articles/:article_id", () => {
		test("Status 200 - Return body contains article object with updated vote count ", () => {
			const body = { inc_votes: 10 };
			return request(app)
				.patch("/api/articles/1")
				.send(body)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).toBe(110);
				});
		});
		test("Status 400 - Invalid body used for patch", () => {
			const body = { inc_votes: "WORD" };
			return request(app)
				.patch("/api/articles/1")
				.send(body)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request.");
				});
		});
		test("Status 400 - Invalid ID format", () => {
			const body = { inc_votes: 10 };
			return request(app)
				.patch("/api/articles/notValid")
				.send(body)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request.");
				});
		});
		test("Status 404 - Invalid ID - path not found", () => {
			const body = { inc_votes: 10 };
			return request(app)
				.patch("/api/articles/1234")
				.send(body)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});
	});
});

describe("/api/users endpoint", () => {
	describe("GET /api/users", () => {
		test("Status 200 - Body contains an object containing an array of users", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then((res) => {
					expect(res.body.users).toHaveLength(4);
					res.body.users.forEach((users) => {
						expect(users).toMatchObject({
							username: expect.any(String),
						});
					});
				});
		});
		test("Status 404 - Path not found", () => {
			return request(app)
				.get("/api/topic")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});
	});
});

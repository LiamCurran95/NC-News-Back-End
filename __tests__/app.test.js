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
		test("Status 200 - Body contains an object containing an array of topics (and includes comment count)", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					expect(body[0]["created_at"]).toBe("2020-11-03T09:12:00.000Z");
					expect(body[1]["created_at"]).toBe("2020-10-18T01:00:00.000Z");
					expect(body[11]["created_at"]).toBe("2020-01-07T14:08:00.000Z");
					expect(body).toHaveLength(12);
					body.forEach((article) => {
						expect(article).toMatchObject({
							comment_count: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							author: expect.any(String),
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
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						comment_count: expect.any(String),
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						body: expect.any(String),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					});
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
					expect(msg).toBe("Valid ID format, this article does not exist.");
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
					expect(msg).toBe("Valid ID format, this article has no comments.");
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

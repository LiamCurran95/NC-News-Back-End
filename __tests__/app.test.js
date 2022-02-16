const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));
afterAll(() => {
	if (db.end) db.end();
});

describe("/api/topics", () => {
	describe("GET topics", () => {
		test("Status 200 - Body contains an object containing an array of topics", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then((res) => {
					expect(res.body.topics).toHaveLength(3);
					res.body.topics.forEach((topic) => {
						expect(res.body.topics).toHaveLength(3);
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

describe("/api/articles", () => {
	describe("GET :article_id", () => {
		test("Status 200 - Body contains an object with the relevant article", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article[0]).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						username: expect.any(String),
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
		test("Status 404 - Valid ID - Doesn't exist within database.", () => {
			return request(app)
				.get(`/api/articles/234`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Valid ID format, article does not exist");
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

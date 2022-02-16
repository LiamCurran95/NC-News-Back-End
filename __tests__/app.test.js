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
					expect(msg).toBe("Path not found within the server.");
				});
		});
	});
});

describe("/api/articles endpoint", () => {
	describe("/api/articles", () => {
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
						expect(msg).toBe("Path not found within the server.");
					});
			});
		});
	});

	describe("/api/articles/:article_id", () => {
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
						expect(msg).toBe("Invalid ID used for GET request.");
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
			test("Status 404 - Path not found.", () => {
				return request(app)
					.get("/api/articl/123")
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Path not found within the server.");
					});
			});
		});
	});
});

describe("/api/users", () => {
	describe("GET users", () => {
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
					expect(msg).toBe("Path not found within the server.");
				});
		});
	});
});

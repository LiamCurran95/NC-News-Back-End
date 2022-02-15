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
					console.log(msg);
					expect(msg).toBe("Invalid ID used for GET request.");
				});
		});
		test("Status 404 - Valid ID - Doesn't exist within database.", () => {
			return request(app)
				.get(`/api/articles/234`)
				.expect(404)
				.then(({ body: { msg } }) => {
					console.log(msg);
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

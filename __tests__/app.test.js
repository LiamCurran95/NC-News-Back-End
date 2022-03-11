//sudo service postgresql start
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { readFile } = require("fs/promises");

beforeEach(() => seed(data));
afterAll(() => {
	if (db.end) db.end();
});

describe("GET /api", () => {
	test("Status 200 - Response is an object containing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(typeof endpoints).toBe("object");
				expect(endpoints["GET /api"]).not.toBe(undefined);
			});
	});
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
				.then(({ body: { articles } }) => {
					expect(articles).toHaveLength(12);
					articles.forEach((article) => {
						expect(article).toEqual(
							expect.objectContaining({
								title: expect.any(String),
								article_id: expect.any(Number),
								topic: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
								author: expect.any(String),
							})
						);
					});
				});
		});
		test("Status 200 - Articles are sorted by date desc by default", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("created_at", { descending: true });
				});
		});
		test("Status 200 - Articles can be sorted with an order query", () => {
			return request(app)
				.get("/api/articles?order=asc")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("created_at", { ascending: true });
				});
		});
		test("Status 200 - Articles can be sorted with an order query, by any column", () => {
			return request(app)
				.get("/api/articles?sort_by=title")
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toBeSortedBy("title", { descending: true });
				});
		});
		test("Status 200 - Additional functionality: comment_count", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body: { articles } }) => {
					articles.forEach((article) => {
						expect(article).toEqual(
							expect.objectContaining({
								comment_count: expect.any(Number),
							})
						);
					});
				});
		});
		test("Status 400 - Error message for invalid order query", () => {
			return request(app)
				.get("/api/articles?order=notgoingtowork")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Invalid - 'asc' or 'desc' only");
				});
		});
		test("Status 400 - Error message for invalid sort query", () => {
			return request(app)
				.get("/api/articles?sort_by=notgoingtowork")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Invalid sort_by");
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
	describe("/api/articles/:article_id", () => {
		describe("GET /api/articles/:article_id", () => {
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
		});
		describe("GET /api/articles/:article_id/comments", () => {
			test("Status 200 - Return body contains an array of comments with respective properties, for an article with a single comment", () => {
				const article_id = 6;
				return request(app)
					.get(`/api/articles/${article_id}/comments`)
					.then(({ body }) => {
						expect(body).toEqual({
							article_comments: [
								{
									comment_id: 16,
									votes: 1,
									created_at: "2020-10-11T15:23:00.000Z",
									author: "butter_bridge",
									body: "This is a bad article name",
									article_id: 6,
								},
							],
						});
					});
			});
			test("Status 200 - Return body contains an array of comments with respective properties, for an article with a multiple comments", () => {
				const article_id = 9;
				return request(app)
					.get(`/api/articles/${article_id}/comments`)
					.then(({ body }) => {
						expect(body).toEqual({
							article_comments: [
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
							],
						});
					});
			});
			test("Status 200 - Valid ID - Article has no comments (comment_count)", () => {
				const article_id = 2;
				return request(app)
					.get(`/api/articles/${article_id}/comments`)
					.expect(200)
					.then(({ body }) => {
						expect(body).toEqual({ article_comments: [] });
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
		describe("POST /api/articles/:article_id/comments", () => {
			test("Status 200 - Return body contains posted comment", () => {
				const comment = {
					author: "butter_bridge",
					body: "Wow,what a great comment!",
				};
				const articleID = 9;
				return request(app)
					.post(`/api/articles/${articleID}/comments`)
					.send(comment, articleID)
					.expect(201)
					.then(({ body }) => {
						console.log(body);
						expect(body).toEqual(
							expect.objectContaining({
								comment: {
									article_id: expect.any(Number),
									author: expect.any(String),
									body: expect.any(String),
									comment_id: expect.any(Number),
									created_at: expect.any(String),
									votes: expect.any(Number),
								},
							})
						);
					});
			});
			test("Status 400 - Invalid body used for post", () => {
				const comment = {
					body: "Wow, what a great review!",
				};
				const articleID = 9;
				return request(app)
					.post(`/api/articles/${articleID}/comments`)
					.send(comment, articleID)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Further information required in body.");
					});
			});
			test("Status 400 - Username does not exist within database", () => {
				const comment = {
					username: "Mr Potatohead",
				};
				const articleID = 9;
				return request(app)
					.post(`/api/articles/${articleID}/comments`)
					.send(comment, articleID)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Further information required in body.");
					});
			});
			test("Status 404 - Article does not exist for a comment to be posted to", () => {
				const comment = {
					author: "butter_bridge",
					body: "Wow,what a great comment!",
				};
				const articleID = 91356;
				return request(app)
					.post(`/api/articles/${articleID}/comments`)
					.send(comment, articleID)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("No matching article.");
					});
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

describe("/api/comments endpoint", () => {
	describe("DELETE /api/comments/:comment_id", () => {
		test("Status 204 - Successfully deleted comment and no response.", () => {
			return request(app)
				.delete("/api/comments/2")
				.expect(204)
				.then(() => {
					return request(app)
						.get("/api/articles/1/comments")
						.expect(200)
						.then(({ body: { article_comments } }) => {
							expect(article_comments).toHaveLength(10);
						});
				});
		});
		test("Status 400 - Unsuccessfully deleted comment as comment ID invalid.", () => {
			return request(app)
				.delete("/api/comments/notarealid")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Bad request.");
				});
		});
		test("Status 404 - Unsuccessfully deleted comment as no comment of that ID.", () => {
			return request(app)
				.delete("/api/comments/1234")
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("No comment found for this ID.");
				});
		});
	});
});

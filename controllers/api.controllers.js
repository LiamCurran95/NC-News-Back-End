exports.getEndpoints = (_, res, next) => {
	res.status(200).send({
		"GET /api": {
			description:
				"Responds with a JSON object detailing the available endpoints",
		},

		"GET /api/topics": {
			description: "Responds with an array of all topics.",
			queries: [],
			expectedStatus: 200,
			exampleResponse: {
				topics: [{ slug: "topic", description: "description of topic" }],
			},
		},

		"GET /api/users": {
			description: "Responds with an array of all users.",
			queries: [],
			expectedStatus: 200,
			exampleResponse: {
				users: [{ username: "username" }],
			},
		},

		"GET /api/users/:username": {
			description:
				"Responds with a user object matching the specified username.",
			queries: [],
			expectedStatus: 200,
			exampleResponse: {
				user: [
					{
						username: "username",
						name: "name",
						avatar_url: "Link to avatar picture",
					},
				],
			},
		},

		"GET /api/articles": {
			description:
				"Responds with an array of articles and a total_count of all the articles matching the filter.",
			queries: [
				"sort_by (author | title | article_id | topic | votes | date | comment_count )",
				"order (asc | desc)",
				"filter (topic - exact match required)",
			],
			expectedStatus: 200,
			exampleResponse: {
				articles: [
					{
						article_id: "number",
						author: "author",
						title: "title",
						created_at: "date",
						topic: "topic",
						votes: "number",
						comment_count: "number of comments on this article",
					},
				],
			},
			total_count: 20,
		},

		"GET /api/articles/:article_id": {
			description:
				"Responds with an article object matching the specified article_id.",
			queries: [],
			expectedStatus: 200,
			exampleResponse: {
				article: {
					article_id: "number",
					author: "author",
					title: "title",
					created_at: "date",
					topic: "topic",
					votes: "number",
					comment_count: "number of comments on this article",
					body: "The content of the article",
				},
			},
		},

		"PATCH /api/articles/:article_id": {
			description:
				"Changes the 'votes' for the article at the article_id parameter by +/- 1.",
			queries: [],
			expectedStatus: 200,
			exampleRequest: { inc_votes: -10 },
			exampleResponse: {
				article: {
					article_id: "number",
					author: "author",
					title: "title",
					created_at: "date",
					topic: "topic",
					votes: "previous number -1",
					comment_count: "number of comments on this article",
					body: "the content of the article",
				},
			},
		},

		"GET /api/articles/:article_id/comments": {
			description:
				"Responds with an array of all comments for an article specified in the article_id parameter",
			expectedStatus: 200,
			exampleResponse: {
				comments: [
					{
						comment_id: "number",
						author: "author",
						created_at: "date",
						votes: "number",
						body: "the content of the comment",
					},
				],
			},
		},

		"POST /api/articles/:article_id/comments": {
			description:
				"Adds a new comment associated with the article_id parameter and responds with an object representing the newly added comment - comment requires a username and a body",
			queries: [],
			expectedStatus: 201,
			exampleRequest: { username: "user", body: "comment content" },
			exampleResponse: {
				comment: [
					{
						comment_id: "number",
						author: "author",
						created_at: "date",
						votes: "number",
						body: "the content of the comment",
					},
				],
			},
		},

		"DELETE /api/comments/:comment_id": {
			description: "Deletes the comment matching the comment_id parameter",
			queries: [],
			expectedStatus: 204,
			exampleResponse: {},
		},
	});
};

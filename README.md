### NC-News Back-End

### This API is Hosted on Heroku

View the API at: https://lc-nc-news.herokuapp.com/api

### Summary of this Project

This project is a demonstration of a RESTful API written in JavaScript and using Express JS alongside PostgreSQL as a database.

A user is able to interact with news data with the following methods:

* GET a list of all of the available endpoints
* GET a list of topics covered by the articles
* GET a list of user that have posted comments to the articles
* GET a list of articles with the ability to filter by topic, sort by various valid fields, decide upon the sort order and customise the pagination limits and view specific pages
* GET a specific article
* PATCH a specific article in order to vote on it
* POST a new comment to a specific article
* DELETE a specific comment

### Setup Locally

To run a local copy of this API you will require:
Node.js (v17.5.0)
npm (8.4.1)
PostgreSQL (12.9)

Any versions of the above tools that pre-date those listed have not been tested and may not work.

## Cloning

Clone this repository via `git clone https://github.com/LiamCurran95/nc-news-BE`

Install dependencies via "npm install"

To create / connect with the databases locally there are two required environment files - create these at the root of the repository:

.env.development - PGDATABASE=nc_news
.env.test - PGDATABASE=nc_news_test

These files are already referenced in the .gitignore.

## Creating and seeding the database

Run the two following commands:
"npm run setup-dbs"
"npm run seed"

## Testing

This API has been tested with Jest, to initialise the tests run the following command:
`npm test`

## Using the API

To run a local version of this app run the following command:
`npm run start`

This will open up a local port (9090, defined in the listen.js file) - requests can be made via apps such as Insomnia.

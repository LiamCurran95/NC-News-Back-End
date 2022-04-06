## Getting Started with Vested

### Hosted App

Please access the hosted version of this app at: https://vested.netlify.app/

### Project Background

This project was created, alongside a back-end database, to encourage first-time investors with an interest in ethical investing explore their options. It’s designed to be used either on desktop or mobile.

The app was developed by team 'Buzzfeed Investors' as part of the Northcoders Software Development bootcamp - please find links below to the GitHub pages for the other members of the team:

* https://github.com/BillyZen
* https://github.com/ellenmelon1
* https://github.com/maire-digital
* https://github.com/mshabuo
* https://github.com/carlc4

### Front-end Repo

The front-end repository is available at: https://github.com/LiamCurran95/vested-FE

### Vested Back-End

### This API is Hosted on Heroku

View the API at: https://vested-2022.herokuapp.com/

### Summary of this Project

There are three endpoints that a user is able to interact with 
* https://vested-2022.herokuapp.com/API/polygon
* https://vested-2022.herokuapp.com/API/users
* https://vested-2022.herokuapp.com/API/esg


* GET an array of all polygon data
* GET an array of all user data
* GET an array of all ESG data
* GET a specific portfolio of a specific user
* PATCH a specific portfolio of a specific user (Used to post/delete as well due to limitations of our schema)
* PATCH a specific users questionnaire answers (Used to post/delete as well due to limitations of our schema)
* POST a new user

## Cloning

Clone this repository via `git clone https://github.com/LiamCurran95/vested-BE`

Install dependencies via "npm install"

## Testing

This API has been tested with Mocha and Chai, to initialise the tests run the following command:
`npm test`

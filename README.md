# Dominic-News-Project

https://dominic-news-project.herokuapp.com/api

This project builds an API to interact with a database to provide information to front end
architecture for a news website.

The above link will take you a JSON object explaining the different endpoints available with this
API and the responses that will be received for the requests.

## Run Locally

First you will need to clone the project into your chosen folder

```bash
  git clone https://github.com/DominicFH/dominic-news-project
```

Go to the project directory

```bash
  cd dominic-news-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

Seed local database

```bash
  npm run seed
```

## Environment Variables

To run this project, you will need to add the following .env files to the root directory:

.env.test: `PGDATABASE=nc_news_test`

.env.development: `PGDATABASE=nc_news`

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Minimum Requirements

To run this project you will require the following minimum versions:

Node.js: `14.17.6`

PostgreSQL: `14.0`

## Future Additions

My work on this project is not yet fully complete and I am looking to add the following features
in the future:

GET /api/users

- This will respond with an array of objects with each object the following property:
  `username`

GET /api/users/:username

- This will respond with a user object which will have the following properties:

  `username`
  `avatar_url`
  `name`

PATCH /api/comments/:comment_id

- This will accept a request body of:

        { inc_votes: newVote }

- The `newVote` value will indicate how much the votes property in the database should be updated by, 1 or -1 for example. This will then respond with the updated comment object.

POST /api/articles

- This will accept a request body of:

        {
            author: username
            title: articleTitle
            body: articleBody
            topic: articleTopic
        }

- The author value will need to be a username from the users table. This will then respond with an article object containing the properties in the request body as well as the following:

  `article_id`
  `votes`
  `created_at`
  `comment_count`

POST /api/topics

- This will accept a request body of:

        {
            slug: topicName
            description: topicDescription
        }

- This will respond with the newly created topic object.

DELETE /api/articles/:article_id

- This will delete the specified article with the provided `article_id`. This request will respond witha status 204 but no content.

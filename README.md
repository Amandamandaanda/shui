# Shui API

A REST API for a social platform where users can register, log in and create posts.

The API is built with Node.js, AWS Lambda and DynamoDB using the Serverless Framework.

## Features

- Register a new user
- Log in with username and password
- Secure password hashing with bcrypt
- JWT-based authentication
- Create posts (authenticated users only)
- Get all posts
- Get a single post by ID
- Filter posts by username
- Update posts (only the post owner)
- Delete posts (only the post owner)
- Input validation using Zod
- Centralized error handling with Middy
- Store users and posts in AWS DynamoDB

## Technologies

- Node.js
- JavaScript (ES Modules)
- AWS Lambda
- AWS API Gateway (HTTP API)
- AWS DynamoDB
- AWS SDK for JavaScript
- Serverless Framework
- Middy
- Zod
- bcrypt
- JSON Web Token (JWT)

## API URL

Base URL:

https://jdr5xpsv48.execute-api.eu-north-1.amazonaws.com

AWS Region: `eu-north-1`

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in | No |
| GET | `/posts` | Get all posts | No |
| GET | `/posts/{postId}` | Get a post by ID | No |
| POST | `/posts` | Create a post | Yes |
| PUT | `/posts/{postId}` | Update a post | Yes, owner only |
| DELETE | `/posts/{postId}` | Delete a post | Yes, owner only |

## Authentication

The API uses JSON Web Tokens (JWT) to authenticate users.

When a user logs in successfully, the API returns a token that is valid for one hour.

Protected endpoints require the token in the Authorization header:

`Authorization: Bearer YOUR_TOKEN`

Users can only update or delete their own posts.

The username used when creating a post is taken from the authenticated user's token, not from the request body.

## Request Examples

### Register a user

POST `/auth/register`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

### Log in

POST `/auth/login`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

### Create a post

POST `/posts`

Requires a valid JWT token.

```json
{
  "title": "My first post",
  "content": "Hello Shui!"
}
```

### Update a post

PUT `/posts/{postId}`

Requires a valid JWT token and ownership of the post.

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

### Filter posts by username

GET `/posts?username=testuser`

Returns posts created by the specified user.

## Database

The API uses Amazon DynamoDB with two tables:

- **Users table:** Stores usernames and hashed passwords.
- **Posts table:** Stores posts, including ID, username, title, content and timestamps.

Passwords are hashed using bcrypt before they are stored.

Posts contain the following properties:

- `id`
- `username`
- `isGuest`
- `title`
- `content`
- `createdAt`
- `updatedAt`

Timestamps use ISO 8601 format.

## Validation and Error Handling

Incoming request bodies are validated using Zod.

Middy middleware is used for JSON body parsing, authentication, validation and error handling.

Errors are returned as JSON objects:

```json
{
  "error": "Error message"
}
```

The API uses appropriate HTTP status codes, including:

- `200 OK` – Request successful
- `201 Created` – Resource created
- `204 No Content` – Resource deleted
- `400 Bad Request` – Invalid request
- `401 Unauthorized` – Authentication required or invalid credentials
- `403 Forbidden` – User does not own the resource
- `404 Not Found` – Resource not found
- `409 Conflict` – Username already exists
- `500 Internal Server Error` – Server error

## Running Locally

### Requirements

- Node.js
- npm
- AWS account and configured AWS credentials
- Serverless Framework

### Installation

1. Clone the repository:

   `git clone https://github.com/Amandamandaanda/shui.git`

2. Navigate into the project:

   `cd shui`

3. Install dependencies:

   `npm install`

4. Create a `.env` file in the project root and add:

   `JWT_SECRET=your_secure_secret`

5. Configure `local.yml` with the required Serverless organization and IAM role settings.

6. Make sure your AWS credentials are configured.

### Deployment

Deploy the API to AWS using:

`npx serverless deploy`

To package the project without deploying:

`npx serverless package`

## Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret used to sign and verify JWT tokens |

The DynamoDB table names are configured automatically through Serverless Framework.

## AWS Resources

The project uses:

- AWS Lambda for executing API functions
- API Gateway for handling HTTP requests
- DynamoDB for persistent data storage
- IAM for access permissions

The DynamoDB tables are created and configured through `serverless.yml`.

## Author

Shui API – Backend development project.

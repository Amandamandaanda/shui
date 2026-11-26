# Shui API

A REST API for a message board where users can register, log in, create posts and manage their own content.

## Features

- Register new users
- Log in with username and password
- Secure password hashing using bcrypt
- JWT-based authentication
- Create posts (authenticated users only)
- Get all posts
- Get a single post by ID
- Filter posts by username
- Update posts (only the post owner)
- Delete posts (only the post owner)
- Input validation using Zod
- Centralized error handling using Middy
- Store users and posts in Amazon DynamoDB

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

**Base URL:**

https://jdr5xpsv48.execute-api.eu-north-1.amazonaws.com

**AWS Region:** `eu-north-1`

**Example endpoint (GET):**

https://jdr5xpsv48.execute-api.eu-north-1.amazonaws.com/posts

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

Protected endpoints require a valid token in the Authorization header:

```http
Authorization: Bearer YOUR_TOKEN
```

Users can only update or delete their own posts.

The username used when creating a post is taken from the authenticated user's JWT token, not from the request body.

## Request Examples

### Register a user

`POST /auth/register`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

### Log in

`POST /auth/login`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

### Create a post

`POST /posts`

Requires a valid JWT token.

```json
{
  "title": "My first post",
  "content": "Hello Shui!"
}
```

### Update a post

`PUT /posts/{postId}`

Requires a valid JWT token and ownership of the post.

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

### Filter posts by username

`GET /posts?username=testuser`

Returns posts created by the specified user.

## Database

The API uses Amazon DynamoDB with two tables:

- **Users table:** Stores usernames and hashed passwords.
- **Posts table:** Stores posts and their information.

Passwords are hashed using bcrypt before they are stored.

Each post contains the following properties:

- `id`
- `username`
- `isGuest`
- `title`
- `content`
- `feedKey`
- `createdAt`
- `updatedAt`
- `createdAtId`

Timestamps use ISO 8601 format.

### Global Secondary Index (GSI)

The posts table uses a Global Secondary Index called `posts-by-date-index`.

The index contains:

- `feedKey` as the partition key.
- `createdAtId` as the sort key.

The index is used with DynamoDB `QueryCommand` to retrieve posts efficiently and sort them by creation date, with the newest posts first.

Posts can also be filtered by username.

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

## Setup and deployment

### Requirements

- Node.js
- npm
- AWS account and configured AWS credentials
- Serverless Framework

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Amandamandaanda/shui.git
```

2. Navigate into the project:

```bash
cd shui
```

3. Install dependencies:

```bash
npm install
```

4. Copy the example environment file:

```bash
cp .env.example .env
```

5. Add a secure JWT secret to your `.env` file:

```env
JWT_SECRET=your_secure_secret
```

6. Create a `local.yml` file in the project root:

```yaml
org: your-serverless-org
role: arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/YOUR_LAMBDA_ROLE
```

Replace the example values with your own Serverless organization and IAM role.

7. Make sure your AWS credentials are configured.

Note: The .env and local.yml files contain local configuration and are not included in the repository. The .env.example file provides a template for the required environment variable.

### Deployment

Deploy the API to AWS:

```bash
npx serverless deploy
```

## Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret used to sign and verify JWT tokens |

The DynamoDB table names are configured automatically through Serverless Framework.

## AWS Resources

The project uses:

- **AWS Lambda** – Executes the API functions.
- **AWS API Gateway** – Handles HTTP requests.
- **Amazon DynamoDB** – Stores users and posts.
- **AWS IAM** – Manages permissions for AWS resources.

The DynamoDB tables and Global Secondary Index are created and configured through `serverless.yml`.

## Author

Shui API – Backend development project.

# Forum API Documentation

This document outlines the API endpoints for the Disc Golf Platform's forum feature.

## Base URL

All API endpoints are relative to: `/api/forum`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Categories

#### List Categories

- **GET** `/categories`
- **Description**: Retrieve a list of all forum categories
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10, max: 100)
- **Response**: 
  ```json
  {
    "categories": [
      {
        "id": 1,
        "name": "General Discussion",
        "description": "General topics about disc golf"
      },
      // ...
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
  ```

#### Get Category

- **GET** `/categories/:id`
- **Description**: Retrieve details of a specific category
- **Response**:
  ```json
  {
    "id": 1,
    "name": "General Discussion",
    "description": "General topics about disc golf",
    "subforums": [
      {
        "id": 1,
        "name": "Beginner Questions",
        "description": "Ask your beginner questions here"
      },
      // ...
    ]
  }
  ```

### Subforums

#### Create Subforum

- **POST** `/subforums`
- **Description**: Create a new subforum (requires admin privileges)
- **Request Body**:
  ```json
  {
    "name": "Beginner Questions",
    "description": "Ask your beginner questions here",
    "categoryId": 1
  }
  ```
- **Response**: 
  ```json
  {
    "id": 1,
    "name": "Beginner Questions",
    "description": "Ask your beginner questions here",
    "categoryId": 1
  }
  ```

#### Get Subforum

- **GET** `/subforums/:id`
- **Description**: Retrieve details of a specific subforum
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10, max: 100)
- **Response**:
  ```json
  {
    "id": 1,
    "name": "Beginner Questions",
    "description": "Ask your beginner questions here",
    "threads": [
      {
        "id": 1,
        "title": "How to throw a backhand?",
        "author": {
          "id": 1,
          "username": "newbie123"
        },
        "createdAt": "2023-05-25T12:00:00Z"
      },
      // ...
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
  ```

### Threads

#### Create Thread

- **POST** `/threads`
- **Description**: Create a new thread
- **Request Body**:
  ```json
  {
    "title": "How to throw a backhand?",
    "content": "I'm new to disc golf and struggling with my backhand throw. Any tips?",
    "subforumId": 1
  }
  ```
- **Response**: 
  ```json
  {
    "id": 1,
    "title": "How to throw a backhand?",
    "content": "I'm new to disc golf and struggling with my backhand throw. Any tips?",
    "author": {
      "id": 1,
      "username": "newbie123"
    },
    "createdAt": "2023-05-25T12:00:00Z",
    "subforumId": 1
  }
  ```

#### Get Thread

- **GET** `/threads/:id`
- **Description**: Retrieve a specific thread with its posts
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10, max: 100)
- **Response**:
  ```json
  {
    "id": 1,
    "title": "How to throw a backhand?",
    "author": {
      "id": 1,
      "username": "newbie123"
    },
    "createdAt": "2023-05-25T12:00:00Z",
    "posts": [
      {
        "id": 1,
        "content": "I'm new to disc golf and struggling with my backhand throw. Any tips?",
        "author": {
          "id": 1,
          "username": "newbie123"
        },
        "createdAt": "2023-05-25T12:00:00Z"
      },
      // ...
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
  ```

#### Delete Thread

- **DELETE** `/threads/:id`
- **Description**: Delete a thread (requires admin privileges or thread ownership)
- **Response**: 
  ```json
  {
    "message": "Thread deleted successfully"
  }
  ```

### Posts

#### Create Post

- **POST** `/posts`
- **Description**: Create a new post in a thread
- **Request Body**:
  ```json
  {
    "content": "Here's a tip: Start by focusing on your grip and stance. Make sure you're gripping the disc firmly but not too tight.",
    "threadId": 1
  }
  ```
- **Response**: 
  ```json
  {
    "id": 2,
    "content": "Here's a tip: Start by focusing on your grip and stance. Make sure you're gripping the disc firmly but not too tight.",
    "author": {
      "id": 2,
      "username": "discgolfpro"
    },
    "createdAt": "2023-05-25T12:15:00Z",
    "threadId": 1
  }
  ```

#### Update Post

- **PUT** `/posts/:id`
- **Description**: Update an existing post (requires post ownership)
- **Request Body**:
  ```json
  {
    "content": "Updated content here"
  }
  ```
- **Response**: 
  ```json
  {
    "id": 2,
    "content": "Updated content here",
    "author": {
      "id": 2,
      "username": "discgolfpro"
    },
    "createdAt": "2023-05-25T12:15:00Z",
    "updatedAt": "2023-05-25T12:30:00Z",
    "threadId": 1
  }
  ```

#### Delete Post

- **DELETE** `/posts/:id`
- **Description**: Delete a post (requires admin privileges or post ownership)
- **Response**: 
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

### Search

#### Search Forum

- **GET** `/search`
- **Description**: Search for threads and posts
- **Query Parameters**:
  - `q`: Search query
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10, max: 100)
- **Response**:
  ```json
  {
    "threads": [
      {
        "id": 1,
        "title": "How to throw a backhand?",
        "author": {
          "id": 1,
          "username": "newbie123"
        },
        "createdAt": "2023-05-25T12:00:00Z",
        "subforum": {
          "id": 1,
          "name": "Beginner Questions"
        }
      },
      // ...
    ],
    "posts": [
      {
        "id": 2,
        "content": "Here's a tip: Start by focusing on your grip and stance. Make sure you're gripping the disc firmly but not too tight.",
        "author": {
          "id": 2,
          "username": "discgolfpro"
        },
        "createdAt": "2023-05-25T12:15:00Z",
        "thread": {
          "id": 1,
          "title": "How to throw a backhand?"
        }
      },
      // ...
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
  ```

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**: Invalid input or parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have the required permissions
- **404 Not Found**: Requested resource not found
- **500 Internal Server Error**: Unexpected server error

Error response body:

```json
{
  "message": "Error description here"
}
```

For validation errors, the response will include an `errors` array:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    // ...
  ]
}
```
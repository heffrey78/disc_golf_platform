# Disc Golf Platform API Design

## Authentication

- POST /api/auth/register
  - Register a new user
  - Request body: { username, password }
  - Response: { userId, username, token }

- POST /api/auth/login
  - Log in an existing user
  - Request body: { username, password }
  - Response: { userId, username, token }

- POST /api/auth/logout
  - Log out the current user
  - Requires authentication
  - Response: { message: "Logged out successfully" }

## Forum Categories

- GET /api/categories
  - Retrieve all forum categories
  - Response: [{ id, name, description }]

- GET /api/categories/:categoryId
  - Retrieve a specific category and its sub-forums
  - Response: { id, name, description, subForums: [{ id, name, description }] }

## Sub-forums

- GET /api/subforums/:subforumId
  - Retrieve a specific sub-forum and its threads
  - Response: { id, name, description, threads: [{ id, title, author, createdAt, replyCount }] }

## Threads

- GET /api/threads/:threadId
  - Retrieve a specific thread and its posts
  - Response: { id, title, content, author, createdAt, posts: [{ id, content, author, createdAt }] }

- POST /api/threads
  - Create a new thread
  - Requires authentication
  - Request body: { subforumId, title, content }
  - Response: { id, title, content, author, createdAt }

- PUT /api/threads/:threadId
  - Update a thread (title or content)
  - Requires authentication (must be thread author or moderator)
  - Request body: { title?, content? }
  - Response: { id, title, content, author, createdAt, updatedAt }

- DELETE /api/threads/:threadId
  - Delete a thread
  - Requires authentication (must be thread author or moderator)
  - Response: { message: "Thread deleted successfully" }

## Posts

- POST /api/posts
  - Create a new post (reply to a thread)
  - Requires authentication
  - Request body: { threadId, content }
  - Response: { id, content, author, createdAt }

- PUT /api/posts/:postId
  - Update a post
  - Requires authentication (must be post author or moderator)
  - Request body: { content }
  - Response: { id, content, author, createdAt, updatedAt }

- DELETE /api/posts/:postId
  - Delete a post
  - Requires authentication (must be post author or moderator)
  - Response: { message: "Post deleted successfully" }

## User Profile

- GET /api/users/:userId
  - Retrieve user profile information
  - Response: { id, username, joinDate, postCount, threadCount }

- PUT /api/users/:userId
  - Update user profile
  - Requires authentication (must be the user)
  - Request body: { email?, avatar? }
  - Response: { id, username, email, avatar }

## Moderation

- POST /api/moderation/flag
  - Flag a thread or post for moderation
  - Requires authentication
  - Request body: { threadId?, postId?, reason }
  - Response: { message: "Content flagged for moderation" }

- PUT /api/moderation/resolve/:flagId
  - Resolve a flagged content issue
  - Requires authentication (must be moderator)
  - Request body: { action: "approve" | "delete" | "edit", newContent? }
  - Response: { message: "Flag resolved" }

This API design covers the basic functionality for our forum feature. As we develop the application, we may need to add more endpoints or modify existing ones to meet specific requirements.
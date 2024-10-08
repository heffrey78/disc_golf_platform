# Disc Golf Platform

This project is a React-based web application for a disc golf platform.

## Project Setup

This project uses Docker for local development and GitHub Actions for CI/CD.

### Prerequisites

- Docker
- Docker Compose
- Node.js (for local development without Docker)

### Running the Application

To run the application using Docker:

```bash
docker-compose up
```

The application will be available at http://localhost:3000.

For local development without Docker:

```bash
npm install
npm start
```

### Running Tests

To run tests:

```bash
npm test
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/ci.yml`.

## Project Structure

The project structure is as follows:

- `src/`: Contains the React application source code
- `public/`: Contains public assets
- `docs/`: Contains project documentation
- `.github/workflows/`: Contains CI/CD configuration

## Forum Feature

We have implemented a forum feature for the Disc Golf Platform. The forum allows users to engage in discussions about disc golf topics. Here are the key components of the forum:

1. Categories: The main topics or sections of the forum.
2. Subforums: Subtopics within each category.
3. Threads: Individual discussion topics created by users.
4. Posts: Replies within a thread.

### Forum Usage

1. Browsing: Users can browse categories, subforums, and threads without logging in.
2. Posting: To create threads or reply to existing ones, users need to register and log in.
3. Admin Features: Admin users have additional privileges such as creating categories and subforums, and moderating content.

### User Roles

1. Regular Users: Can create threads and posts.
2. Admin Users: Have full moderation capabilities and can manage forum structure.

The following documents provide more details about the forum feature:

- `docs/feature_specifications.md`: Outlines the specifications for the forum feature
- `docs/feature_breakdown.md`: Provides a breakdown of features, including prioritization, user stories, and acceptance criteria
- `docs/feature_dependencies.mmd`: A Mermaid diagram showing the dependencies between different forum features
- `docs/system_architecture.mmd`: A Mermaid diagram illustrating the overall system architecture

## Design and UX Planning

The following documents provide information about the design and user experience of the application:

- `docs/style_guide.md`: Contains the style guide for the application, including color schemes, typography, and component designs
- `docs/wireframes.mmd`: A Mermaid diagram showing wireframes for key pages
- `docs/user_flow.mmd`: A Mermaid diagram illustrating the user flow through the application
- `docs/api_design.md`: Detailed design of RESTful API endpoints for each feature
- `docs/api_documentation.mmd`: A Mermaid diagram providing a visual representation of the API structure

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Contributing

Please refer to the design and UX planning documents in the `docs/` directory when contributing to this project. These documents serve as a guide for the development process and should be updated as the project progresses.

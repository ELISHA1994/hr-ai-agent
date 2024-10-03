# HR AI Agent

## Overview

HR AI Agent is a chatbot application designed to assist with HR-related queries. It leverages LangChain, MongoDB, and various AI models to provide accurate and helpful responses.

## Features

- Chatbot interface for HR-related queries
- Integration with MongoDB for data storage and retrieval
- Utilizes LangChain for advanced AI capabilities
- Supports multiple AI models including OpenAI and Anthropic

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB Atlas account
- Environment variables set up in a `.env` file

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ELISHA1994/hr-ai-agent.git
    cd hr-ai-agent
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB Atlas URI and other necessary environment variables:
    ```env
    MONGODB_ATLAS_URI=your_mongodb_atlas_uri
    PORT=3000
    OPENAI_API_KEY=your_openai_api_key
    LANGCHAIN_API_KEY=your_langchain_api_key
    LANGCHAIN_TRACING_V2=true
    ```

## Usage

### Development

To start the development server, run:
```sh
npm run dev
```

### Seeding the Database

To seed the database with initial data, run:
```sh
npm run seed
```

## API Endpoints

- `GET /`: Returns a welcome message.
- `POST /chat`: Starts a new chat session.
     ```body
      Request body: { "message": "your initial message" }
     ```
- `POST /chat/:threadId`: Continues an existing chat session.
     ```body
      Request body: { "message": "your message" }
     ```
  
## Project Structure

- `index.ts`: Entry point of the application.
- `agent.ts`: Contains the logic for the AI agent.
- `seed-database.ts`: Script to seed the database.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `package.json`: Project metadata and dependencies
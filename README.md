# Hirer Advisor

Hirer Advisor is a web application that helps users create professional gig descriptions for freelance projects. It uses AI to provide suggestions and improvements for different sections of the gig description.

## Features

- Section-by-section guided journey to create a complete gig description
- AI-powered interface for getting suggestions

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **AI**: OpenAI API (GPT-4o-mini)

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository

2. Install dependencies for the frontend:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the backend:
   ```
   cd server
   npm install
   ```

4. Configure the OpenAI API key:
   - Create a `.env` file in the server directory
   - Add your OpenAI API key to the `.env` file:
     ```
     PORT=3001
     OPENAI_API_KEY=your_openai_api_key_here
     ```

## Running the Application

### Development Mode

Start the frontend:
```
cd client
npm run dev
```

Start the backend:
```
cd server
npm run dev
```

- Frontend will be available at: http://localhost:5173
- Backend will be available at: http://localhost:3001

### Production Mode

Build the frontend:
```
cd client
npm run build
```

Start the backend:
```
cd server
npm start
```

## Usage

1. Fill out the gig description form with your project details
2. Use the AI chat interface to get help with the overall gig description
3. Use the AI suggest button to get suggestions for specific sections

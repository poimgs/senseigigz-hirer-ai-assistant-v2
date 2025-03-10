# Hirer Advisor

Hirer Advisor is a web application that helps users create professional gig descriptions for freelance projects. It uses AI to provide suggestions and improvements for different sections of the gig description.

## Features

- Interactive form for creating gig descriptions
- AI-powered chat interface for getting help and suggestions
- Section-by-section improvement recommendations
- Real-time AI assistance using OpenAI's API

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **AI**: OpenAI API (GPT-4 Turbo)

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

## API Endpoints

### POST /api/chat
Process a conversation with the AI assistant.

**Request Body:**
```json
{
  "messages": [
    { "id": 1, "sender": "user", "text": "Help me with my job title" }
  ],
  "gigDescription": {
    "title": "",
    "summary": "",
    "companyBackground": "",
    "deliverables": "",
    "responsibilities": "",
    "successCriteria": "",
    "skills": "",
    "budget": "",
    "timeline": "",
    "communication": "",
    "ownership": "",
    "confidentiality": "",
    "notes": ""
  }
}
```

**Response:**
```json
{
  "text": "AI response text",
  "section": "title",
  "suggestion": "Suggested content for the section"
}
```

### POST /api/improve
Get AI suggestions to improve a specific section of the gig description.

**Request Body:**
```json
{
  "section": "title",
  "content": "Current content of the section",
  "gigDescription": {
    "title": "Current title",
    "summary": "Current summary",
    "companyBackground": "Current company background",
    "deliverables": "Current deliverables",
    "responsibilities": "Current responsibilities",
    "successCriteria": "Current success criteria",
    "skills": "Current skills",
    "budget": "Current budget",
    "timeline": "Current timeline",
    "communication": "Current communication",
    "ownership": "Current ownership",
    "confidentiality": "Current confidentiality",
    "notes": "Current notes"
  }
}
```

**Response:**
```json
{
  "text": "AI response text",
  "suggestion": "Improved content for the section"
}
```

## Usage

1. Fill out the gig description form with your project details
2. Use the AI chat interface to get help with specific sections
3. Apply AI suggestions to improve your gig description
4. Export or share your completed gig description

## License

MIT

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// JSON Schema for job description updates
const jobDescriptionSchema = {
  "name": "job_description_update",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "section": {
        "type": "string",
        "description": "Name of the job description section being updated."
      },
      "suggested_update": {
        "type": "string",
        "description": "AI-generated suggestion or edit for the specified section."
      },
      "explanation": {
        "type": "string",
        "description": "Brief explanation detailing why the suggestion improves the job description."
      }
    },
    "required": [
      "section",
      "suggested_update",
      "explanation"
    ],
    "additionalProperties": false
  }
};

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, gigDescription } = req.body;
    
    // Create a system message with context about the application
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant helping a user create a professional gig description for a freelance project. 

The gig description has the following sections:
- Title: A clear, specific title for the job
- Summary: A concise overview of the project
- Company Background: Context about the company and industry
- Deliverables: Tangible outputs expected from the freelancer
- Required Skills: Technical skills and relevant experience required
- Budget: Budget range and payment terms
- Timeline: Project schedule and key milestones
- Communication: Preferred communication methods
- Ownership: Who will own the finished work and IP
- Confidentiality: NDA requirements and confidentiality concerns
- Additional Notes: Any other relevant information

Provide helpful, professional suggestions to improve the gig description. If appropriate, format lists as bullet points starting with • for better readability. Be concise but thorough in your responses.`
    };

    // Add context about the current gig description if available
    if (gigDescription) {
      systemMessage.content += '\n\nCurrent gig description:\n';
      Object.entries(gigDescription).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          systemMessage.content += `\n${key}: ${value}`;
        }
      });
    }

    // Prepare conversation history for OpenAI
    const conversationHistory = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversationHistory,
      response_format: {
        "type": "json_schema",
        "json_schema": jobDescriptionSchema
      },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    let parsedResponse = null;
    let section = null;
    let suggestion = null;
    
    try {
      parsedResponse = JSON.parse(aiResponse);
      if (parsedResponse && parsedResponse.section && parsedResponse.suggested_update) {
        section = parsedResponse.section;
        suggestion = parsedResponse.suggested_update;
      }
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      
      // Fallback to the old parsing logic if JSON parsing fails
      const sectionKeywords = {
        'title': 'title',
        'summary': 'summary',
        'company background': 'companyBackground',
        'deliverables': 'deliverables',
        'skills': 'skills',
        'budget': 'budget',
        'timeline': 'timeline',
        'communication': 'communication',
        'ownership': 'ownership',
        'confidentiality': 'confidentiality',
        'notes': 'notes'
      };
      
      // Check if the response contains a suggestion block
      const suggestionMatch = aiResponse.match(/```([\s\S]*?)```/);
      if (suggestionMatch) {
        suggestion = suggestionMatch[1].trim();
        
        // Try to determine which section this suggestion is for
        for (const [keyword, sectionKey] of Object.entries(sectionKeywords)) {
          if (aiResponse.toLowerCase().includes(`for ${keyword}`) || 
              aiResponse.toLowerCase().includes(`${keyword} section`)) {
            section = sectionKey;
            break;
          }
        }
      }
    }

    res.json({
      text: aiResponse,
      section,
      suggestion
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
});

// Endpoint to improve a specific section
app.post('/api/improve', async (req, res) => {
  try {
    const { section, content, gigDescription } = req.body;
    
    // Create a system message with context
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant helping a user improve a specific section of their freelance gig description. 

The user wants help with the "${section}" section. Provide a well-formatted, professional improvement to this section. Format lists as bullet points starting with • for better readability when appropriate.`
    };

    // Add context about the current gig description
    if (gigDescription) {
      systemMessage.content += '\n\nHere\'s the current content of the entire gig description for context:\n';
      Object.entries(gigDescription).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          systemMessage.content += `\n${key}: ${value}`;
        }
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        systemMessage,
        {
          role: 'user',
          content: `Please improve the ${section} section of my gig description. Here's the current content:\n\n${content || 'This section is currently empty.'}`
        }
      ],
      response_format: {
        "type": "json_schema",
        "json_schema": jobDescriptionSchema
      },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    let parsedResponse = null;
    let improvedContent = null;
    
    try {
      parsedResponse = JSON.parse(aiResponse);
      if (parsedResponse && parsedResponse.suggested_update) {
        improvedContent = parsedResponse.suggested_update;
      }
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      
      // Fallback to the old extraction method
      improvedContent = aiResponse;
      const contentMatch = aiResponse.match(/```([\s\S]*?)```/);
      if (contentMatch) {
        improvedContent = contentMatch[1].trim();
      }
    }

    res.json({
      text: aiResponse,
      suggestion: improvedContent
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

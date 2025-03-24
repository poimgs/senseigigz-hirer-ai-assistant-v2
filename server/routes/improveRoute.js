import { openai } from '../config/openai.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// JSON Schema for job description updates
const jobDescriptionSchema = {
  name: "job_description_update",
  strict: true,
  schema: {
    type: "object",
    properties: {
      section: {
        type: "string",
        description: "Name of the job description section being updated."
      },
      suggested_update: {
        type: "string",
        description: "AI-generated suggestion or edit for the specified section."
      },
      explanation: {
        type: "string",
        description: "Brief explanation detailing why the suggestion improves the job description."
      }
    },
    required: ["section", "suggested_update", "explanation"],
    additionalProperties: false
  }
};

const createSystemMessage = (gigDescription, specificSection = '') => {
  let content = `You are an AI assistant helping a user create a professional gig description for a freelance project. 

The gig description has the following sections:
• Title: A clear, specific title for the job
• Summary: A concise overview of the project
• Company Background: Context about the company and industry
• Deliverables: Tangible outputs expected from the freelancer
• Required Skills: Technical skills and relevant experience required
• Budget: Budget range and payment terms
• Timeline: Project schedule and key milestones
• Communication: Preferred communication methods
• Ownership: Who will own the finished work and IP
• Confidentiality: NDA requirements and confidentiality concerns
• Additional Notes: Any other relevant information`;

  if (specificSection) {
    content += `\n\nThe user wants help with the "${specificSection}" section. Provide a well-formatted, professional improvement to this section.`;
  }

  if (gigDescription) {
    content += '\n\nCurrent gig description:\n';
    Object.entries(gigDescription).forEach(([key, value]) => {
      if (value?.trim()) {
        content += `\n${key}: ${value}`;
      }
    });
  }

  return { role: 'system', content };
};

const parseAIResponse = (aiResponse) => {
  try {
    const parsedResponse = JSON.parse(aiResponse);
    if (parsedResponse?.section && parsedResponse?.suggested_update) {
      return parsedResponse;
    }
  } catch (e) {
    console.error('Error parsing JSON response:', e);
    
    // Fallback parsing logic
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
    
    const suggestionMatch = aiResponse.match(/```([\s\S]*?)```/);
    if (suggestionMatch) {
      const suggestion = suggestionMatch[1].trim();
      let section = null;
      
      for (const [keyword, sectionKey] of Object.entries(sectionKeywords)) {
        if (aiResponse.toLowerCase().includes(`for ${keyword}`) || 
            aiResponse.toLowerCase().includes(`${keyword} section`)) {
          section = sectionKey;
          break;
        }
      }
      
      return { section, suggested_update: suggestion };
    }
  }
  return null;
};


export const improveRoute = asyncHandler(async (req, res) => {
  const { section, content, gigDescription } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      createSystemMessage(gigDescription, section),
      {
        role: 'user',
        content: `Please improve the ${section} section of my gig description. Here's the current content:\n\n${content || 'This section is currently empty.'}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: jobDescriptionSchema
    },
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const aiResponse = completion.choices[0].message.content;
  const parsedResponse = parseAIResponse(aiResponse);
  
  res.json({
    text: aiResponse,
    section: parsedResponse?.section,
    suggestion: parsedResponse?.suggested_update
  });
});

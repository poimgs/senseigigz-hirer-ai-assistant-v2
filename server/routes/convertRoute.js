import { openai } from '../config/openai.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const gigSchema = {
  name: "GigDescription",
  strict: true,
  schema: {
    type: "object",
    properties: {
      title: {
        type: ["string", "null"],
        description: "The title of the gig."
      },
      summary: {
        type: ["string", "null"],
        description: "A brief summary of the gig."
      },
      companyBackground: {
        type: ["string", "null"],
        description: "Background information about the company offering the gig."
      },
      deliverables: {
        type: ["string", "null"],
        description: "Description of the expected deliverables for the gig."
      },
      skills: {
        type: ["string", "null"],
        description: "Skills required to complete the gig."
      },
      budget: {
        type: ["string", "null"],
        description: "The budget allocated for the gig."
      },
      timeline: {
        type: ["string", "null"],
        description: "The expected timeline for completion of the gig."
      },
      communication: {
        type: ["string", "null"],
        description: "Details about communication expectations."
      },
      ownership: {
        type: ["string", "null"],
        description: "Information about ownership of work completed."
      },
      confidentiality: {
        type: ["string", "null"],
        description: "Confidentiality agreements or restrictions."
      },
      notes: {
        type: ["string", "null"],
        description: "Additional notes relevant to the gig."
      }
    },
    required: [
      "title",
      "summary",
      "companyBackground",
      "deliverables",
      "skills",
      "budget",
      "timeline",
      "communication",
      "ownership",
      "confidentiality",
      "notes"
    ],
    additionalProperties: false
  }
};

const createSystemMessage = () => ({
  role: 'system',
  content: `You are an AI assistant that extracts structured job posting information from user-provided text. Your task is to identify and return relevant details in the following fields. If you are unable to find relevant details for the field, return null:

Title – A clear and specific title for the job.

Summary – A concise overview of the project, including its goals and scope.

Company Background – Context about the company and the industry it operates in.

Deliverables – Tangible outputs or outcomes expected from the freelancer.

Required Skills – Technical skills, tools, or relevant experience required for the role.

Budget – Budget range and/or payment terms.

Timeline – Project duration, deadlines, and any key milestones.

Communication – Preferred methods and frequency of communication.

Ownership – Who will own the finished work and any associated intellectual property.

Confidentiality – NDA requirements or other confidentiality expectations.

Additional Notes – Any other relevant information not captured above.

Important Instructions:

Do not hallucinate or fabricate details not supported by the input.`
});

export const convertTextToGig = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      createSystemMessage(),
      {
        role: 'user',
        content: text
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: gigSchema
    },
    temperature: 0.7,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const convertedData = completion.choices[0].message.content;
  
  res.json(JSON.parse(convertedData));
});

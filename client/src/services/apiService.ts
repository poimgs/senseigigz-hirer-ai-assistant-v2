import { Gig, GigDescription } from "../types/gig";

// Define message type for chat interactions
export type MessageType = {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  section?: string;
  suggestion?: string;
};

// Define the response type for improve section API
interface ImproveResponse {
  suggestion: string | null;
  explanation: string | null;
}

const apiService = {
  // Base URL for API calls
  baseUrl: 'http://localhost:3001/api',

  // Helper function to convert null values to empty strings
  convertNullToEmptyString(obj: any): any {
    if (obj === null) return '';
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertNullToEmptyString(item));
    }
    
    const result: any = {};
    for (const key in obj) {
      result[key] = this.convertNullToEmptyString(obj[key]);
    }
    return result;
  },

  // Get improvement suggestions for a specific section
  async improveSection(
    section: string,  
    gigDescription: Gig,
    currentSuggestion: string
  ): Promise<ImproveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/improve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          gigDescription,
          currentSuggestion
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling improve API:', error);
      return {
        suggestion: null,
        explanation: null
      };
    }
  },

  // Convert plain text to structured gig description
  async convertTextToGig(text: string): Promise<GigDescription> {
    try {
      const response = await fetch(`${this.baseUrl}/convert-text-to-gig`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return this.convertNullToEmptyString(data);
    } catch (error) {
      console.error('Error calling convert-text API:', error);
      throw error;
    }
  },
};

export default apiService;

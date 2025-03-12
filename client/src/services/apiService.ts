import { GigDescription } from "../types/gig";

// Define the response type for improve section API
interface ImproveResponse {
  text: string;
  suggestion: string | null;
}

const apiService = {
  // Base URL for API calls
  baseUrl: 'http://localhost:3001/api',

  // Get improvement suggestions for a specific section
  async improveSection(section: string, content: string, gigDescription: GigDescription): Promise<ImproveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/improve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          content,
          gigDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling improve API:', error);
      return {
        text: 'Sorry, I encountered an error. Please try again later.',
        suggestion: null,
      };
    }
  },
};

export default apiService;

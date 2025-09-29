import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";
import db from "../db";

const openAIKey = secret("OpenAIKey");

interface IngestIdeaRequest {
  input: string;
  inputType: "url" | "text";
  feedSourceId?: number; // Optional reference to feed source
}

interface IngestIdeaResponse {
  id: number;
  title: string;
  summary: string;
  keyPoints: string[];
}

// Ingests a new idea from URL or text and generates a summary.
export const ingestIdea = api<IngestIdeaRequest, IngestIdeaResponse>(
  { auth: false, expose: true, method: "POST", path: "/ideas/ingest" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    // TODO: Integrate with OpenAI to analyze content and generate summary
    // For now, create a more realistic mock summary based on input type
    let mockTitle: string;
    let canonicalUrl: string | null = null;
    
    if (req.inputType === 'url') {
      // Extract domain and path for better title generation
      try {
        const url = new URL(req.input);
        const domain = url.hostname.replace('www.', '');
        const path = url.pathname.split('/').filter(p => p).pop() || '';
        mockTitle = `Article from ${domain}: ${path}`.replace(/[-_]/g, ' ');
        canonicalUrl = req.input;
      } catch {
        mockTitle = `Web Article: ${req.input.substring(0, 50)}...`;
        canonicalUrl = req.input;
      }
    } else {
      // For text input, use first few words as title
      const words = req.input.split(' ').slice(0, 8).join(' ');
      mockTitle = `Idea: ${words}${req.input.length > words.length ? '...' : ''}`;
    }

    const mockSummary = req.inputType === 'url' 
      ? `This article from ${canonicalUrl} contains valuable insights that could be transformed into engaging content. The piece discusses relevant industry topics and provides actionable information that would resonate with our target audience across multiple platforms.`
      : `This text-based idea explores: "${req.input.substring(0, 100)}${req.input.length > 100 ? '...' : ''}". The concept offers potential for developing comprehensive content that addresses current trends and provides value to readers.`;

    const mockKeyPoints = req.inputType === 'url' 
      ? [
          "Key insights from the original article",
          "Industry trends and developments discussed", 
          "Actionable takeaways for content creation",
          "Potential angles for different platforms"
        ]
      : [
          "Core concept from the provided text",
          "Potential expansion opportunities",
          "Target audience considerations",
          "Content format possibilities"
        ];

    // Store in database
    const result = await db.queryRow<{id: number}>`
      INSERT INTO ideas (input_type, input_value, title, canonical_url, summary, key_points, status)
      VALUES (${req.inputType}, ${req.input}, ${mockTitle}, 
              ${canonicalUrl}, ${mockSummary}, 
              ${JSON.stringify(mockKeyPoints)}, 'new')
      RETURNING id
    `;

    return {
      id: result!.id,
      title: mockTitle,
      summary: mockSummary,
      keyPoints: mockKeyPoints,
    };
  }
);

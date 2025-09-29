import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";
import db from "../db";

const openAIKey = secret("OpenAIKey");

interface IngestIdeaRequest {
  input: string;
  inputType: "url" | "text";
}

interface IngestIdeaResponse {
  id: number;
  title: string;
  summary: string;
  keyPoints: string[];
}

// Ingests a new idea from URL or text and generates a summary.
export const ingestIdea = api<IngestIdeaRequest, IngestIdeaResponse>(
  { auth: true, expose: true, method: "POST", path: "/ideas/ingest" },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

    // TODO: Integrate with OpenAI to analyze content and generate summary
    // For now, create a mock summary
    const mockTitle = req.inputType === 'url' 
      ? `Article Analysis: ${req.input.split('/').pop()}`
      : `Text Analysis: ${req.input.substring(0, 50)}...`;

    const mockSummary = `This is a generated summary of the provided ${req.inputType}. The content discusses relevant topics and provides insights that could be valuable for content creation. This summary would typically be 80-120 words long and capture the key themes and actionable insights from the source material.`;

    const mockKeyPoints = [
      "Key insight extracted from content",
      "Important trend or development mentioned", 
      "Actionable takeaway for audience",
      "Relevant industry implication"
    ];

    // Store in database
    const result = await db.queryRow<{id: number}>`
      INSERT INTO ideas (input_type, input_value, title, canonical_url, summary, key_points, status)
      VALUES (${req.inputType}, ${req.input}, ${mockTitle}, 
              ${req.inputType === 'url' ? req.input : null}, ${mockSummary}, 
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

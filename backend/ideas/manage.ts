import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Query } from "encore.dev/api";
import db from "../db";

interface Idea {
  id: number;
  inputType: string;
  inputValue: string;
  title: string | null;
  canonicalUrl: string | null;
  summary: string | null;
  keyPoints: string[];
  status: string;
  createdAt: Date;
}

interface ListIdeasParams {
  status?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListIdeasResponse {
  ideas: Idea[];
  total: number;
}

interface ApproveIdeaRequest {
  id: number;
  platforms: string[];
  imageMode?: "upload" | "template";
}

interface ApproveIdeaResponse {
  success: boolean;
  draftsCreated: number;
}

// Retrieves ideas filtered by status.
export const listIdeas = api<ListIdeasParams, ListIdeasResponse>(
  { auth: false, expose: true, method: "GET", path: "/ideas" },
  async (params) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const status = params.status;

    let whereClause = '';
    const queryParams: any[] = [];
    
    if (status) {
      whereClause = 'WHERE status = $1';
      queryParams.push(status);
    }

    const ideas = await db.rawQueryAll<{
      id: number;
      input_type: string;
      input_value: string;
      title: string | null;
      canonical_url: string | null;
      summary: string | null;
      key_points: any;
      status: string;
      created_at: Date;
    }>(`
      SELECT id, input_type, input_value, title, canonical_url, summary, key_points, status, created_at
      FROM ideas 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, ...queryParams, limit, offset);

    const totalResult = await db.rawQueryRow<{count: number}>(`
      SELECT COUNT(*) as count FROM ideas ${whereClause}
    `, ...queryParams);

    return {
      ideas: ideas.map(idea => ({
        id: idea.id,
        inputType: idea.input_type,
        inputValue: idea.input_value,
        title: idea.title,
        canonicalUrl: idea.canonical_url,
        summary: idea.summary,
        keyPoints: Array.isArray(idea.key_points) ? idea.key_points : [],
        status: idea.status,
        createdAt: idea.created_at,
      })),
      total: totalResult?.count || 0,
    };
  }
);

// Approves an idea and creates platform-specific drafts.
export const approveIdea = api<ApproveIdeaRequest, ApproveIdeaResponse>(
  { auth: false, expose: true, method: "POST", path: "/ideas/:id/approve" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    // Update idea status
    await db.exec`
      UPDATE ideas SET status = 'approved', updated_at = NOW()
      WHERE id = ${req.id}
    `;

    // Create platform selections for each requested platform
    let draftsCreated = 0;
    for (const platform of req.platforms) {
      await db.exec`
        INSERT INTO idea_platform_selections (idea_id, platform, image_mode, status)
        VALUES (${req.id}, ${platform}, ${req.imageMode || 'template'}, 'draft')
      `;
      draftsCreated++;
    }

    return {
      success: true,
      draftsCreated,
    };
  }
);

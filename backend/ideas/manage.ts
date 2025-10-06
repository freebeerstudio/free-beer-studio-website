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
  { auth: true, expose: true, method: "GET", path: "/ideas" },
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

interface GetIdeaPlatformsRequest {
  id: number;
}

interface GetIdeaPlatformsResponse {
  platforms: string[];
}

// Gets existing platform selections for an idea
export const getIdeaPlatforms = api<GetIdeaPlatformsRequest, GetIdeaPlatformsResponse>(
  { auth: false, expose: true, method: "GET", path: "/ideas/:id/platforms" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const platforms = await db.queryAll<{platform: string}>`
      SELECT DISTINCT platform FROM idea_platform_selections 
      WHERE idea_id = ${req.id}
      ORDER BY platform
    `;

    return {
      platforms: platforms.map(p => p.platform),
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
    // Only create drafts that don't already exist
    let draftsCreated = 0;
    for (const platform of req.platforms) {
      // Check if draft already exists for this idea-platform combination
      const existingDraft = await db.queryRow<{id: number}>`
        SELECT id FROM idea_platform_selections 
        WHERE idea_id = ${req.id} AND platform = ${platform}
      `;

      if (!existingDraft) {
        // Only create if doesn't exist
        await db.exec`
          INSERT INTO idea_platform_selections (idea_id, platform, image_mode, status)
          VALUES (${req.id}, ${platform}, ${req.imageMode || 'template'}, 'draft')
        `;
        draftsCreated++;
      }
    }

    return {
      success: true,
      draftsCreated,
    };
  }
);

interface ScheduledPost {
  id: number;
  ideaId: number;
  platform: string;
  ideaTitle: string;
  ideaSummary: string;
  draftContent: string;
  scheduledAt: Date;
  imageUrl?: string;
  imageMode: string;
  createdAt: Date;
}

interface ListScheduledPostsResponse {
  scheduledPosts: ScheduledPost[];
}

interface UpdateScheduledPostRequest {
  id: number;
  scheduledAt?: Date;
  draftContent?: string;
}

interface UpdateScheduledPostResponse {
  success: boolean;
}

interface CancelScheduledPostRequest {
  id: number;
}

interface CancelScheduledPostResponse {
  success: boolean;
}

// Get all scheduled posts grouped by platform
export const listScheduledPosts = api<void, ListScheduledPostsResponse>(
  { auth: false, expose: true, method: "GET", path: "/ideas/scheduled" },
  async () => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const scheduledPosts = await db.queryAll<{
      id: number;
      idea_id: number;
      platform: string;
      draft_content: string;
      scheduled_at: Date;
      image_url: string | null;
      image_mode: string;
      created_at: Date;
      idea_title: string | null;
      idea_summary: string | null;
    }>`
      SELECT 
        ips.id, 
        ips.idea_id, 
        ips.platform, 
        ips.draft_content, 
        ips.scheduled_at, 
        ips.image_url, 
        ips.image_mode,
        ips.created_at,
        i.title as idea_title,
        i.summary as idea_summary
      FROM idea_platform_selections ips
      JOIN ideas i ON ips.idea_id = i.id
      WHERE ips.status = 'scheduled'
      ORDER BY ips.scheduled_at ASC
    `;

    return {
      scheduledPosts: scheduledPosts.map(post => ({
        id: post.id,
        ideaId: post.idea_id,
        platform: post.platform,
        ideaTitle: post.idea_title || 'Untitled',
        ideaSummary: post.idea_summary || '',
        draftContent: post.draft_content || '',
        scheduledAt: post.scheduled_at,
        imageUrl: post.image_url || undefined,
        imageMode: post.image_mode,
        createdAt: post.created_at,
      })),
    };
  }
);

// Update a scheduled post (reschedule or edit content)
export const updateScheduledPost = api<UpdateScheduledPostRequest, UpdateScheduledPostResponse>(
  { auth: false, expose: true, method: "PUT", path: "/ideas/scheduled/:id" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (req.scheduledAt !== undefined) {
      paramCount++;
      updates.push(`scheduled_at = $${paramCount}`);
      values.push(req.scheduledAt);
    }

    if (req.draftContent !== undefined) {
      paramCount++;
      updates.push(`draft_content = $${paramCount}`);
      values.push(req.draftContent);
    }

    if (updates.length === 0) {
      throw new Error("No updates provided");
    }

    paramCount++;
    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    await db.rawExec(`
      UPDATE idea_platform_selections 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount} AND status = 'scheduled'
    `, ...values);

    return {
      success: true,
    };
  }
);

// Cancel a scheduled post
export const cancelScheduledPost = api<CancelScheduledPostRequest, CancelScheduledPostResponse>(
  { auth: false, expose: true, method: "DELETE", path: "/ideas/scheduled/:id" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    // Update status to rejected instead of deleting
    await db.exec`
      UPDATE idea_platform_selections 
      SET status = 'rejected', updated_at = NOW()
      WHERE id = ${req.id} AND status = 'scheduled'
    `;

    return {
      success: true,
    };
  }
);

interface RejectIdeaRequest {
  id: number;
}

interface RejectIdeaResponse {
  success: boolean;
}

// Rejects an idea
export const rejectIdea = api<RejectIdeaRequest, RejectIdeaResponse>(
  { auth: false, expose: true, method: "POST", path: "/ideas/:id/reject" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    // Update idea status to rejected
    await db.exec`
      UPDATE ideas SET status = 'rejected', updated_at = NOW()
      WHERE id = ${req.id}
    `;

    return {
      success: true,
    };
  }
);

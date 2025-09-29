import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Query } from "encore.dev/api";
import db from "../db";

interface PlatformDraft {
  id: number;
  ideaId: number;
  platform: string;
  imageMode: string;
  imageUrl: string | null;
  draftContent: string | null;
  draftMetadata: any;
  status: string;
  scheduledAt: Date | null;
  createdAt: Date;
  idea: {
    title: string | null;
    summary: string | null;
    keyPoints: string[];
  };
}

interface ListDraftsParams {
  status?: Query<string>;
  platform?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListDraftsResponse {
  drafts: PlatformDraft[];
  total: number;
}

interface ApproveDraftRequest {
  id: number;
  scheduledAt?: Date;
}

interface ApproveDraftResponse {
  success: boolean;
}

// Retrieves platform drafts filtered by status and platform.
export const listDrafts = api<ListDraftsParams, ListDraftsResponse>(
  { auth: true, expose: true, method: "GET", path: "/ideas/drafts" },
  async (params) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

    const limit = params.limit || 20;
    const offset = params.offset || 0;
    
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 1;

    if (params.status) {
      whereConditions.push(`ips.status = $${paramCount++}`);
      queryParams.push(params.status);
    }

    if (params.platform) {
      whereConditions.push(`ips.platform = $${paramCount++}`);
      queryParams.push(params.platform);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const drafts = await db.rawQueryAll<{
      id: number;
      idea_id: number;
      platform: string;
      image_mode: string;
      image_url: string | null;
      draft_content: string | null;
      draft_metadata: any;
      status: string;
      scheduled_at: Date | null;
      created_at: Date;
      idea_title: string | null;
      idea_summary: string | null;
      idea_key_points: any;
    }>(`
      SELECT 
        ips.id, ips.idea_id, ips.platform, ips.image_mode, ips.image_url,
        ips.draft_content, ips.draft_metadata, ips.status, ips.scheduled_at, ips.created_at,
        i.title as idea_title, i.summary as idea_summary, i.key_points as idea_key_points
      FROM idea_platform_selections ips
      JOIN ideas i ON ips.idea_id = i.id
      ${whereClause}
      ORDER BY ips.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, ...queryParams, limit, offset);

    const totalResult = await db.rawQueryRow<{count: number}>(`
      SELECT COUNT(*) as count 
      FROM idea_platform_selections ips
      JOIN ideas i ON ips.idea_id = i.id
      ${whereClause}
    `, ...queryParams);

    return {
      drafts: drafts.map(draft => ({
        id: draft.id,
        ideaId: draft.idea_id,
        platform: draft.platform,
        imageMode: draft.image_mode,
        imageUrl: draft.image_url,
        draftContent: draft.draft_content,
        draftMetadata: draft.draft_metadata || {},
        status: draft.status,
        scheduledAt: draft.scheduled_at,
        createdAt: draft.created_at,
        idea: {
          title: draft.idea_title,
          summary: draft.idea_summary,
          keyPoints: Array.isArray(draft.idea_key_points) ? draft.idea_key_points : [],
        },
      })),
      total: totalResult?.count || 0,
    };
  }
);

// Approves a draft and schedules it for publishing.
export const approveDraft = api<ApproveDraftRequest, ApproveDraftResponse>(
  { auth: true, expose: true, method: "POST", path: "/ideas/drafts/:id/approve" },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

    const scheduledAt = req.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from now

    await db.exec`
      UPDATE idea_platform_selections 
      SET status = 'scheduled', scheduled_at = ${scheduledAt}, updated_at = NOW()
      WHERE id = ${req.id}
    `;

    return { success: true };
  }
);

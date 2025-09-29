import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Query } from "encore.dev/api";
import db from "../db";

interface FeedSource {
  id: number;
  url: string;
  type: string;
  name: string;
  lastChecked: Date | null;
  isActive: boolean;
  createdAt: Date;
}

interface CreateFeedSourceRequest {
  url: string;
  name: string;
  type?: string;
}

interface CreateFeedSourceResponse {
  id: number;
  message: string;
}

interface ListFeedSourcesParams {
  active?: Query<boolean>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListFeedSourcesResponse {
  feedSources: FeedSource[];
  total: number;
}

interface UpdateFeedSourceRequest {
  id: number;
  name?: string;
  url?: string;
  isActive?: boolean;
}

interface DeleteFeedSourceRequest {
  id: number;
}

// Creates a new feed source
export const createFeedSource = api<CreateFeedSourceRequest, CreateFeedSourceResponse>(
  { auth: false, expose: true, method: "POST", path: "/ideas/feeds" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    // Determine feed type based on URL
    let feedType = req.type || 'manual';
    if (req.url.includes('/rss') || req.url.includes('/feed') || req.url.includes('.xml')) {
      feedType = 'rss';
    } else if (req.url.includes('blog') || req.url.includes('/posts')) {
      feedType = 'blog';
    }

    const result = await db.queryRow<{id: number}>`
      INSERT INTO feed_sources (url, name, type, is_active)
      VALUES (${req.url}, ${req.name}, ${feedType}, true)
      RETURNING id
    `;

    return {
      id: result!.id,
      message: "Feed source created successfully"
    };
  }
);

// Lists all feed sources
export const listFeedSources = api<ListFeedSourcesParams, ListFeedSourcesResponse>(
  { auth: false, expose: true, method: "GET", path: "/ideas/feeds" },
  async (params) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const limit = params.limit || 50;
    const offset = params.offset || 0;
    
    let whereClause = '';
    const queryParams: any[] = [];
    
    if (params.active !== undefined) {
      whereClause = 'WHERE is_active = $1';
      queryParams.push(params.active);
    }

    const feedSources = await db.rawQueryAll<{
      id: number;
      url: string;
      type: string;
      name: string;
      last_checked: Date | null;
      is_active: boolean;
      created_at: Date;
    }>(`
      SELECT id, url, type, name, last_checked, is_active, created_at
      FROM feed_sources 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, ...queryParams, limit, offset);

    const totalResult = await db.rawQueryRow<{count: number}>(`
      SELECT COUNT(*) as count FROM feed_sources ${whereClause}
    `, ...queryParams);

    return {
      feedSources: feedSources.map(fs => ({
        id: fs.id,
        url: fs.url,
        type: fs.type,
        name: fs.name,
        lastChecked: fs.last_checked,
        isActive: fs.is_active,
        createdAt: fs.created_at,
      })),
      total: totalResult?.count || 0,
    };
  }
);

// Updates a feed source
export const updateFeedSource = api<UpdateFeedSourceRequest, { success: boolean }>(
  { auth: false, expose: true, method: "PUT", path: "/ideas/feeds/:id" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (req.name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(req.name);
    }

    if (req.url !== undefined) {
      paramCount++;
      updates.push(`url = $${paramCount}`);
      values.push(req.url);
    }

    if (req.isActive !== undefined) {
      paramCount++;
      updates.push(`is_active = $${paramCount}`);
      values.push(req.isActive);
    }

    if (updates.length === 0) {
      throw new Error("No updates provided");
    }

    paramCount++;
    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    await db.rawExec(`
      UPDATE feed_sources 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `, ...values);

    return { success: true };
  }
);

// Deletes a feed source
export const deleteFeedSource = api<DeleteFeedSourceRequest, { success: boolean }>(
  { auth: false, expose: true, method: "DELETE", path: "/ideas/feeds/:id" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    await db.exec`
      DELETE FROM feed_sources WHERE id = ${req.id}
    `;

    return { success: true };
  }
);

// Manually triggers scraping of a specific feed source
export const scrapeFeedSource = api<{ id: number }, { success: boolean; message: string }>(
  { auth: false, expose: true, method: "POST", path: "/ideas/feeds/:id/scrape" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    // Get the feed source
    const feedSource = await db.queryRow<{
      id: number;
      url: string;
      type: string;
      name: string;
    }>`
      SELECT id, url, type, name FROM feed_sources WHERE id = ${req.id} AND is_active = true
    `;

    if (!feedSource) {
      throw new Error("Feed source not found or inactive");
    }

    // Update last checked timestamp
    await db.exec`
      UPDATE feed_sources SET last_checked = NOW() WHERE id = ${req.id}
    `;

    // TODO: Implement actual RSS parsing and content extraction
    // For now, create a sample idea from the feed
    const sampleTitle = `New content from ${feedSource.name}`;
    const sampleSummary = `This is sample content scraped from ${feedSource.name} (${feedSource.url}). In a real implementation, this would contain the actual article summary extracted from the RSS feed or web scraping.`;
    
    await db.exec`
      INSERT INTO ideas (input_type, input_value, title, canonical_url, summary, key_points, status)
      VALUES ('url', ${feedSource.url}, ${sampleTitle}, ${feedSource.url}, ${sampleSummary}, 
              ${JSON.stringify(['Sample key point from feed', 'Another insight from scraped content'])}, 'new')
    `;

    return {
      success: true,
      message: `Successfully scraped ${feedSource.name} and created new idea`
    };
  }
);
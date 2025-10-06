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
  { auth: true, expose: true, method: "POST", path: "/ideas/feeds" },
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

    let ideasCreated = 0;

    try {
      // Fetch the RSS feed
      const response = await fetch(feedSource.url, {
        headers: {
          'User-Agent': 'Free Beer Studio Content Scraper 1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const feedContent = await response.text();
      
      // Parse RSS/XML feed content
      const articles = parseRSSFeed(feedContent);
      
      // Create ideas for each article
      for (const article of articles) {
        try {
          await db.exec`
            INSERT INTO ideas (input_type, input_value, title, canonical_url, summary, key_points, status)
            VALUES ('url', ${article.url}, ${article.title}, ${article.url}, ${article.summary}, 
                    ${JSON.stringify(article.keyPoints)}, 'new')
          `;
          ideasCreated++;
        } catch (dbError) {
          // Skip duplicate articles (might have unique constraint on canonical_url)
          console.log(`Skipped duplicate article: ${article.title}`);
        }
      }

      // Update last checked timestamp
      await db.exec`
        UPDATE feed_sources SET last_checked = NOW() WHERE id = ${req.id}
      `;

      return {
        success: true,
        message: `Successfully scraped ${feedSource.name} and created ${ideasCreated} new ideas from ${articles.length} articles`
      };

    } catch (error) {
      console.error('Feed scraping error:', error);
      
      // Update last checked timestamp even on error
      await db.exec`
        UPDATE feed_sources SET last_checked = NOW() WHERE id = ${req.id}
      `;

      // Still create a fallback idea so user gets some feedback
      const fallbackTitle = `Feed Update: ${feedSource.name}`;
      const fallbackSummary = `Attempted to scrape ${feedSource.name} but encountered an issue: ${error instanceof Error ? error.message : 'Unknown error'}. This may be due to RSS format issues or network problems. The feed URL is: ${feedSource.url}`;
      
      await db.exec`
        INSERT INTO ideas (input_type, input_value, title, canonical_url, summary, key_points, status)
        VALUES ('url', ${feedSource.url}, ${fallbackTitle}, ${feedSource.url}, ${fallbackSummary}, 
                ${JSON.stringify(['Feed scraping error', 'Check feed URL format', 'Verify RSS feed accessibility'])}, 'new')
      `;

      return {
        success: false,
        message: `Error scraping ${feedSource.name}: ${error instanceof Error ? error.message : 'Unknown error'}. Created fallback idea for troubleshooting.`
      };
    }
  }
);

// Simple RSS feed parser
function parseRSSFeed(xmlContent: string): Array<{
  title: string;
  url: string;
  summary: string;
  keyPoints: string[];
}> {
  const articles: Array<{
    title: string;
    url: string;
    summary: string;
    keyPoints: string[];
  }> = [];

  try {
    // Basic XML parsing for RSS feeds
    // This is a simple implementation - in production you'd use a proper XML parser
    
    // Find all <item> tags (RSS) or <entry> tags (Atom)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
    
    let matches;
    
    // Try RSS format first
    matches = Array.from(xmlContent.matchAll(itemRegex));
    
    // If no RSS items found, try Atom format
    if (matches.length === 0) {
      matches = Array.from(xmlContent.matchAll(entryRegex));
    }

    for (const match of matches.slice(0, 10)) { // Limit to 10 most recent articles
      const itemContent = match[1];
      
      const title = extractXMLTag(itemContent, 'title') || 'Untitled Article';
      const link = extractXMLTag(itemContent, 'link') || extractXMLTag(itemContent, 'guid') || '';
      const description = extractXMLTag(itemContent, 'description') || extractXMLTag(itemContent, 'summary') || extractXMLTag(itemContent, 'content') || '';
      
      if (title && link) {
        // Clean up description by removing HTML tags
        const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
        const summary = cleanDescription.length > 200 
          ? cleanDescription.substring(0, 200) + '...'
          : cleanDescription;

        articles.push({
          title: title.trim(),
          url: link.trim(),
          summary: summary || `Article from RSS feed: ${title}`,
          keyPoints: [
            'Content extracted from RSS feed',
            'Requires further analysis for key insights',
            'Potential for multi-platform content adaptation',
            'Original source material for content creation'
          ]
        });
      }
    }
  } catch (error) {
    console.error('RSS parsing error:', error);
  }

  return articles;
}

// Helper function to extract content from XML tags
function extractXMLTag(content: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = content.match(regex);
  if (match) {
    // Handle CDATA sections
    const cdataMatch = match[1].match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return cdataMatch ? cdataMatch[1] : match[1];
  }
  
  // Try self-closing tag or href attribute for links
  if (tagName === 'link') {
    const linkRegex = /<link[^>]*href=['"]([^'"]*)['"]/i;
    const linkMatch = content.match(linkRegex);
    if (linkMatch) return linkMatch[1];
  }
  
  return null;
}
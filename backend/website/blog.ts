import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

interface BlogPost {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  coverImageUrl: string | null;
  gallery: string[];
  body: string | null;
  excerpt: string | null;
  publishedAt: Date | null;
  author: {
    id: string;
    email: string;
  } | null;
}

interface ListBlogPostsParams {
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListBlogPostsResponse {
  posts: BlogPost[];
  total: number;
}

interface GetBlogPostParams {
  slug: string;
}

// Retrieves published blog posts for the public website.
export const listBlogPosts = api<ListBlogPostsParams, ListBlogPostsResponse>(
  { expose: true, method: "GET", path: "/blog" },
  async (params) => {
    const limit = params.limit || 10;
    const offset = params.offset || 0;

    const [posts, total] = await Promise.all([
      db.queryAll<{
        id: number;
        title: string;
        subtitle: string | null;
        slug: string;
        cover_image_url: string | null;
        gallery: any;
        body: string | null;
        excerpt: string | null;
        published_at: Date | null;
        author_id: string | null;
        author_email: string | null;
      }>`
        SELECT 
          bp.id, bp.title, bp.subtitle, bp.slug, bp.cover_image_url, 
          bp.gallery, bp.body, bp.excerpt, bp.published_at, 
          u.id as author_id, u.email as author_email
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
        WHERE bp.status = 'published' AND bp.published_at <= NOW()
        ORDER BY bp.published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      db.queryRow<{count: number}>`
        SELECT COUNT(*) as count
        FROM blog_posts
        WHERE status = 'published' AND published_at <= NOW()
      `,
    ]);

    return {
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        slug: post.slug,
        coverImageUrl: post.cover_image_url,
        gallery: Array.isArray(post.gallery) ? post.gallery : [],
        body: post.body,
        excerpt: post.excerpt,
        publishedAt: post.published_at,
        author: post.author_id ? {
          id: post.author_id,
          email: post.author_email || '',
        } : null,
      })),
      total: total?.count || 0,
    };
  }
);

// Retrieves a single blog post by slug.
export const getBlogPost = api<GetBlogPostParams, BlogPost>(
  { expose: true, method: "GET", path: "/blog/:slug" },
  async (params) => {
    const post = await db.queryRow<{
      id: number;
      title: string;
      subtitle: string | null;
      slug: string;
      cover_image_url: string | null;
      gallery: any;
      body: string | null;
      excerpt: string | null;
      published_at: Date | null;
      author_id: string | null;
      author_email: string | null;
    }>`
      SELECT 
        bp.id, bp.title, bp.subtitle, bp.slug, bp.cover_image_url, 
        bp.gallery, bp.body, bp.excerpt, bp.published_at, 
        u.id as author_id, u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.slug = ${params.slug} AND bp.status = 'published' AND bp.published_at <= NOW()
    `;

    if (!post) {
      throw new Error("Blog post not found");
    }

    return {
      id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      slug: post.slug,
      coverImageUrl: post.cover_image_url,
      gallery: Array.isArray(post.gallery) ? post.gallery : [],
      body: post.body,
      excerpt: post.excerpt,
      publishedAt: post.published_at,
      author: post.author_id ? {
        id: post.author_id,
        email: post.author_email || '',
      } : null,
    };
  }
);

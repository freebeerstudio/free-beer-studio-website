import { api } from "encore.dev/api";
import db from "../db";

interface CreatePricingItemRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  features: string[];
  isFeatured?: boolean;
  sortOrder?: number;
}

interface UpdatePricingItemRequest {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  features?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
}

interface CreateProjectRequest {
  title: string;
  description?: string;
  coverImageUrl?: string;
  gallery?: string[];
  externalUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

interface UpdateProjectRequest {
  id: number;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  gallery?: string[];
  externalUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

interface CreateBlogPostRequest {
  title: string;
  subtitle?: string;
  slug: string;
  coverImageUrl?: string;
  gallery?: string[];
  body?: string;
  excerpt?: string;
  status?: "draft" | "scheduled" | "published";
  scheduledAt?: Date;
  source?: "manual" | "ai" | "idea_engine";
  ideaId?: number;
}

interface UpdateBlogPostRequest {
  id: number;
  title?: string;
  subtitle?: string;
  slug?: string;
  coverImageUrl?: string;
  gallery?: string[];
  body?: string;
  excerpt?: string;
  status?: "draft" | "scheduled" | "published";
  scheduledAt?: Date;
  source?: "manual" | "ai" | "idea_engine";
  ideaId?: number;
}

interface PricingItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  features: string[];
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ListPricingItemsResponse {
  items: PricingItem[];
}

interface Project {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  externalUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ListProjectsResponse {
  projects: Project[];
}

interface BlogPost {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  coverImageUrl: string | null;
  gallery: string[];
  body: string | null;
  excerpt: string | null;
  status: "draft" | "scheduled" | "published";
  scheduledAt: Date | null;
  publishedAt: Date | null;
  source: "manual" | "ai" | "idea_engine";
  ideaId: number | null;
  author: {
    id: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ListBlogPostsResponse {
  posts: BlogPost[];
}

// Creates a new pricing item.
export const createPricingItem = api<CreatePricingItemRequest, {id: number}>(
  { expose: true, method: "POST", path: "/admin/pricing" },
  async (req) => {

    const result = await db.queryRow<{id: number}>`
      INSERT INTO pricing_items (title, description, image_url, price, features, is_featured, sort_order)
      VALUES (${req.title}, ${req.description || null}, ${req.imageUrl || null}, ${req.price || null}, 
              ${JSON.stringify(req.features)}, ${req.isFeatured || false}, ${req.sortOrder || 0})
      RETURNING id
    `;

    return { id: result!.id };
  }
);

// Updates an existing pricing item.
export const updatePricingItem = api<UpdatePricingItemRequest, {success: boolean}>(
  { expose: true, method: "PUT", path: "/admin/pricing/:id" },
  async (req) => {

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (req.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(req.title);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(req.description);
    }
    if (req.imageUrl !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(req.imageUrl);
    }
    if (req.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(req.price);
    }
    if (req.features !== undefined) {
      updates.push(`features = $${paramCount++}`);
      values.push(JSON.stringify(req.features));
    }
    if (req.isFeatured !== undefined) {
      updates.push(`is_featured = $${paramCount++}`);
      values.push(req.isFeatured);
    }
    if (req.sortOrder !== undefined) {
      updates.push(`sort_order = $${paramCount++}`);
      values.push(req.sortOrder);
    }

    if (updates.length === 0) {
      return { success: true };
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());

    values.push(req.id);
    const query = `UPDATE pricing_items SET ${updates.join(', ')} WHERE id = $${paramCount}`;

    await db.rawExec(query, ...values);
    return { success: true };
  }
);

// Creates a new portfolio project.
export const createProject = api<CreateProjectRequest, {id: number}>(
  { expose: true, method: "POST", path: "/admin/projects" },
  async (req) => {

    const result = await db.queryRow<{id: number}>`
      INSERT INTO projects (title, description, cover_image_url, gallery, external_url, is_featured, sort_order)
      VALUES (${req.title}, ${req.description || null}, ${req.coverImageUrl || null}, 
              ${JSON.stringify(req.gallery || [])}, ${req.externalUrl || null}, 
              ${req.isFeatured || false}, ${req.sortOrder || 0})
      RETURNING id
    `;

    return { id: result!.id };
  }
);

// List all projects for admin management.
export const listProjects = api<void, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/admin/projects" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      gallery: any;
      external_url: string | null;
      is_featured: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, description, cover_image_url, gallery, external_url, is_featured, sort_order, created_at, updated_at
      FROM projects
      ORDER BY sort_order ASC, created_at DESC
    `;

    return {
      projects: rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        coverImageUrl: row.cover_image_url,
        gallery: Array.isArray(row.gallery) ? row.gallery : [],
        externalUrl: row.external_url,
        isFeatured: row.is_featured,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }
);

// Get a single project by ID.
export const getProject = api<{id: number}, Project>(
  { expose: true, method: "GET", path: "/admin/projects/:id" },
  async (req) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      gallery: any;
      external_url: string | null;
      is_featured: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, description, cover_image_url, gallery, external_url, is_featured, sort_order, created_at, updated_at
      FROM projects
      WHERE id = ${req.id}
    `;

    if (!row) {
      throw new Error("Project not found");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      coverImageUrl: row.cover_image_url,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      externalUrl: row.external_url,
      isFeatured: row.is_featured,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

// Updates an existing project.
export const updateProject = api<UpdateProjectRequest, {success: boolean}>(
  { expose: true, method: "PUT", path: "/admin/projects/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (req.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(req.title);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(req.description);
    }
    if (req.coverImageUrl !== undefined) {
      updates.push(`cover_image_url = $${paramCount++}`);
      values.push(req.coverImageUrl);
    }
    if (req.gallery !== undefined) {
      updates.push(`gallery = $${paramCount++}`);
      values.push(JSON.stringify(req.gallery));
    }
    if (req.externalUrl !== undefined) {
      updates.push(`external_url = $${paramCount++}`);
      values.push(req.externalUrl);
    }
    if (req.isFeatured !== undefined) {
      updates.push(`is_featured = $${paramCount++}`);
      values.push(req.isFeatured);
    }
    if (req.sortOrder !== undefined) {
      updates.push(`sort_order = $${paramCount++}`);
      values.push(req.sortOrder);
    }

    if (updates.length === 0) {
      return { success: true };
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());

    values.push(req.id);
    const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount}`;

    await db.rawExec(query, ...values);
    return { success: true };
  }
);

// Deletes a project.
export const deleteProject = api<{id: number}, {success: boolean}>(
  { expose: true, method: "DELETE", path: "/admin/projects/:id" },
  async (req) => {
    await db.rawExec(`DELETE FROM projects WHERE id = $1`, req.id);
    return { success: true };
  }
);

// Creates a new blog post.
export const createBlogPost = api<CreateBlogPostRequest, {id: number}>(
  { expose: true, method: "POST", path: "/admin/blog" },
  async (req) => {

    const publishedAt = req.status === 'published' ? new Date() : req.scheduledAt || null;

    const result = await db.queryRow<{id: number}>`
      INSERT INTO blog_posts (title, subtitle, slug, cover_image_url, gallery, body, excerpt, 
                              status, scheduled_at, published_at, author_id, source, idea_id)
      VALUES (${req.title}, ${req.subtitle || null}, ${req.slug}, ${req.coverImageUrl || null}, 
              ${JSON.stringify(req.gallery || [])}, ${req.body || null}, ${req.excerpt || null},
              ${req.status || 'draft'}, ${req.scheduledAt || null}, ${publishedAt}, ${'admin-1'},
              ${req.source || 'manual'}, ${req.ideaId || null})
      RETURNING id
    `;

    return { id: result!.id };
  }
);

// List all blog posts for admin management.
export const listBlogPosts = api<{source?: string}, ListBlogPostsResponse>(
  { expose: true, method: "GET", path: "/admin/blog" },
  async (req) => {
    const rows = req.source 
      ? await db.queryAll<{
          id: number;
          title: string;
          subtitle: string | null;
          slug: string;
          cover_image_url: string | null;
          gallery: any;
          body: string | null;
          excerpt: string | null;
          status: "draft" | "scheduled" | "published";
          scheduled_at: Date | null;
          published_at: Date | null;
          source: "manual" | "ai" | "idea_engine";
          idea_id: number | null;
          author_id: string | null;
          author_email: string | null;
          created_at: Date;
          updated_at: Date;
        }>`
          SELECT 
            bp.id, bp.title, bp.subtitle, bp.slug, bp.cover_image_url, 
            bp.gallery, bp.body, bp.excerpt, bp.status, bp.scheduled_at, bp.published_at,
            bp.source, bp.idea_id, bp.created_at, bp.updated_at,
            u.id as author_id, u.email as author_email
          FROM blog_posts bp
          LEFT JOIN users u ON bp.author_id = u.id
          WHERE bp.source = ${req.source}
          ORDER BY bp.created_at DESC
        `
      : await db.queryAll<{
          id: number;
          title: string;
          subtitle: string | null;
          slug: string;
          cover_image_url: string | null;
          gallery: any;
          body: string | null;
          excerpt: string | null;
          status: "draft" | "scheduled" | "published";
          scheduled_at: Date | null;
          published_at: Date | null;
          source: "manual" | "ai" | "idea_engine";
          idea_id: number | null;
          author_id: string | null;
          author_email: string | null;
          created_at: Date;
          updated_at: Date;
        }>`
          SELECT 
            bp.id, bp.title, bp.subtitle, bp.slug, bp.cover_image_url, 
            bp.gallery, bp.body, bp.excerpt, bp.status, bp.scheduled_at, bp.published_at,
            bp.source, bp.idea_id, bp.created_at, bp.updated_at,
            u.id as author_id, u.email as author_email
          FROM blog_posts bp
          LEFT JOIN users u ON bp.author_id = u.id
          ORDER BY bp.created_at DESC
        `;

    return {
      posts: rows.map(row => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        slug: row.slug,
        coverImageUrl: row.cover_image_url,
        gallery: Array.isArray(row.gallery) ? row.gallery : [],
        body: row.body,
        excerpt: row.excerpt,
        status: row.status,
        scheduledAt: row.scheduled_at,
        publishedAt: row.published_at,
        source: row.source,
        ideaId: row.idea_id,
        author: row.author_id ? {
          id: row.author_id,
          email: row.author_email || '',
        } : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }
);

// Get a single blog post by ID.
export const getBlogPost = api<{id: number}, BlogPost>(
  { expose: true, method: "GET", path: "/admin/blog/:id" },
  async (req) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      subtitle: string | null;
      slug: string;
      cover_image_url: string | null;
      gallery: any;
      body: string | null;
      excerpt: string | null;
      status: "draft" | "scheduled" | "published";
      scheduled_at: Date | null;
      published_at: Date | null;
      source: "manual" | "ai" | "idea_engine";
      idea_id: number | null;
      author_id: string | null;
      author_email: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT 
        bp.id, bp.title, bp.subtitle, bp.slug, bp.cover_image_url, 
        bp.gallery, bp.body, bp.excerpt, bp.status, bp.scheduled_at, bp.published_at,
        bp.source, bp.idea_id, bp.created_at, bp.updated_at,
        u.id as author_id, u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.id = ${req.id}
    `;

    if (!row) {
      throw new Error("Blog post not found");
    }

    return {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      slug: row.slug,
      coverImageUrl: row.cover_image_url,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      body: row.body,
      excerpt: row.excerpt,
      status: row.status,
      scheduledAt: row.scheduled_at,
      publishedAt: row.published_at,
      source: row.source,
      ideaId: row.idea_id,
      author: row.author_id ? {
        id: row.author_id,
        email: row.author_email || '',
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

// Updates an existing blog post.
export const updateBlogPost = api<UpdateBlogPostRequest, {success: boolean}>(
  { expose: true, method: "PUT", path: "/admin/blog/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (req.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(req.title);
    }
    if (req.subtitle !== undefined) {
      updates.push(`subtitle = $${paramCount++}`);
      values.push(req.subtitle);
    }
    if (req.slug !== undefined) {
      updates.push(`slug = $${paramCount++}`);
      values.push(req.slug);
    }
    if (req.coverImageUrl !== undefined) {
      updates.push(`cover_image_url = $${paramCount++}`);
      values.push(req.coverImageUrl);
    }
    if (req.gallery !== undefined) {
      updates.push(`gallery = $${paramCount++}`);
      values.push(JSON.stringify(req.gallery));
    }
    if (req.body !== undefined) {
      updates.push(`body = $${paramCount++}`);
      values.push(req.body);
    }
    if (req.excerpt !== undefined) {
      updates.push(`excerpt = $${paramCount++}`);
      values.push(req.excerpt);
    }
    if (req.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(req.status);
      
      // Update published_at if status is being set to published
      if (req.status === 'published') {
        updates.push(`published_at = $${paramCount++}`);
        values.push(new Date());
      }
    }
    if (req.scheduledAt !== undefined) {
      updates.push(`scheduled_at = $${paramCount++}`);
      values.push(req.scheduledAt);
    }
    if (req.source !== undefined) {
      updates.push(`source = $${paramCount++}`);
      values.push(req.source);
    }
    if (req.ideaId !== undefined) {
      updates.push(`idea_id = $${paramCount++}`);
      values.push(req.ideaId);
    }

    if (updates.length === 0) {
      return { success: true };
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());

    values.push(req.id);
    const query = `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramCount}`;

    await db.rawExec(query, ...values);
    return { success: true };
  }
);

// Deletes a blog post.
export const deleteBlogPost = api<{id: number}, {success: boolean}>(
  { expose: true, method: "DELETE", path: "/admin/blog/:id" },
  async (req) => {
    await db.rawExec(`DELETE FROM blog_posts WHERE id = $1`, req.id);
    return { success: true };
  }
);

// List all pricing items for admin management.
export const listPricingItems = api<void, ListPricingItemsResponse>(
  { expose: true, method: "GET", path: "/admin/pricing" },
  async () => {

    const rows = await db.queryAll<{
      id: number;
      title: string;
      description: string | null;
      image_url: string | null;
      price: number | null;
      features: any;
      is_featured: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, description, image_url, price, features, is_featured, sort_order, created_at, updated_at
      FROM pricing_items
      ORDER BY sort_order ASC, created_at ASC
    `;

    return {
      items: rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        imageUrl: row.image_url,
        price: row.price,
        features: Array.isArray(row.features) ? row.features : [],
        isFeatured: row.is_featured,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }
);

// Get a single pricing item by ID.
export const getPricingItem = api<{id: number}, PricingItem>(
  { expose: true, method: "GET", path: "/admin/pricing/:id" },
  async (req) => {

    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      image_url: string | null;
      price: number | null;
      features: any;
      is_featured: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, description, image_url, price, features, is_featured, sort_order, created_at, updated_at
      FROM pricing_items
      WHERE id = ${req.id}
    `;

    if (!row) {
      throw new Error("Pricing item not found");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      price: row.price,
      features: Array.isArray(row.features) ? row.features : [],
      isFeatured: row.is_featured,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

// Deletes a pricing item.
export const deletePricingItem = api<{id: number}, {success: boolean}>(
  { expose: true, method: "DELETE", path: "/admin/pricing/:id" },
  async (req) => {

    await db.rawExec(`DELETE FROM pricing_items WHERE id = $1`, req.id);
    return { success: true };
  }
);

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

// Creates a new blog post.
export const createBlogPost = api<CreateBlogPostRequest, {id: number}>(
  { expose: true, method: "POST", path: "/admin/blog" },
  async (req) => {

    const publishedAt = req.status === 'published' ? new Date() : req.scheduledAt || null;

    const result = await db.queryRow<{id: number}>`
      INSERT INTO blog_posts (title, subtitle, slug, cover_image_url, gallery, body, excerpt, 
                              status, scheduled_at, published_at, author_id)
      VALUES (${req.title}, ${req.subtitle || null}, ${req.slug}, ${req.coverImageUrl || null}, 
              ${JSON.stringify(req.gallery || [])}, ${req.body || null}, ${req.excerpt || null},
              ${req.status || 'draft'}, ${req.scheduledAt || null}, ${publishedAt}, ${'admin-1'})
      RETURNING id
    `;

    return { id: result!.id };
  }
);

// List all pricing items for admin management.
export const listPricingItems = api<void, {items: any[]}>(
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
export const getPricingItem = api<{id: number}, any>(
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

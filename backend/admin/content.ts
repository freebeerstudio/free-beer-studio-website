import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
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
  { auth: true, expose: true, method: "POST", path: "/admin/pricing" },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

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
  { auth: true, expose: true, method: "PUT", path: "/admin/pricing/:id" },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

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
  { auth: true, expose: true, method: "POST", path: "/admin/projects" },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

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
  { auth: true, expose: true, method: "POST", path: "/admin/blog" },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

    const publishedAt = req.status === 'published' ? new Date() : req.scheduledAt || null;

    const result = await db.queryRow<{id: number}>`
      INSERT INTO blog_posts (title, subtitle, slug, cover_image_url, gallery, body, excerpt, 
                              status, scheduled_at, published_at, author_id)
      VALUES (${req.title}, ${req.subtitle || null}, ${req.slug}, ${req.coverImageUrl || null}, 
              ${JSON.stringify(req.gallery || [])}, ${req.body || null}, ${req.excerpt || null},
              ${req.status || 'draft'}, ${req.scheduledAt || null}, ${publishedAt}, ${auth.userID})
      RETURNING id
    `;

    return { id: result!.id };
  }
);

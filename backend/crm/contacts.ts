import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  companyId?: number;
  companyName?: string;
  contextId?: number;
  contextName?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  birthday?: string;
  avatarUrl?: string;
  status: string;
  source?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ListContactsParams {
  contextId?: Query<number>;
  status?: Query<string>;
  search?: Query<string>;
  companyId?: Query<number>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListContactsResponse {
  contacts: Contact[];
  total: number;
}

interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  companyId?: number;
  contextId?: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  birthday?: string;
  status?: string;
  source?: string;
  tags?: string[];
}

interface UpdateContactRequest {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  companyId?: number;
  contextId?: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  birthday?: string;
  status?: string;
  source?: string;
  tags?: string[];
}

interface ContactResponse {
  contact: Contact;
}

// List contacts with filtering
export const listContacts = api<ListContactsParams, ListContactsResponse>(
  { auth: false, expose: true, method: "GET", path: "/crm/contacts" },
  async (params) => {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    
    let whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (params.contextId) {
      paramCount++;
      whereConditions.push(`c.context_id = $${paramCount}`);
      queryParams.push(params.contextId);
    }

    if (params.status) {
      paramCount++;
      whereConditions.push(`c.status = $${paramCount}`);
      queryParams.push(params.status);
    }

    if (params.companyId) {
      paramCount++;
      whereConditions.push(`c.company_id = $${paramCount}`);
      queryParams.push(params.companyId);
    }

    if (params.search) {
      paramCount++;
      whereConditions.push(`(
        c.first_name ILIKE $${paramCount} OR 
        c.last_name ILIKE $${paramCount} OR 
        c.email ILIKE $${paramCount} OR
        comp.name ILIKE $${paramCount}
      )`);
      queryParams.push(`%${params.search}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    paramCount++;
    const limitParam = paramCount;
    paramCount++;
    const offsetParam = paramCount;

    const contacts = await db.rawQueryAll<{
      id: number;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string | null;
      mobile: string | null;
      title: string | null;
      company_id: number | null;
      company_name: string | null;
      context_id: number | null;
      context_name: string | null;
      linkedin_url: string | null;
      twitter_url: string | null;
      website: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
      postal_code: string | null;
      birthday: string | null;
      avatar_url: string | null;
      status: string;
      source: string | null;
      created_at: Date;
      updated_at: Date;
    }>(`
      SELECT 
        c.*,
        comp.name as company_name,
        ctx.name as context_name
      FROM crm_contacts c
      LEFT JOIN crm_companies comp ON c.company_id = comp.id
      LEFT JOIN crm_contexts ctx ON c.context_id = ctx.id
      ${whereClause}
      ORDER BY c.last_name, c.first_name
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `, ...queryParams, limit, offset);

    const totalResult = await db.rawQueryRow<{count: number}>(`
      SELECT COUNT(*) as count 
      FROM crm_contacts c
      LEFT JOIN crm_companies comp ON c.company_id = comp.id
      ${whereClause}
    `, ...queryParams);

    return {
      contacts: contacts.map(c => ({
        id: c.id,
        firstName: c.first_name,
        lastName: c.last_name,
        email: c.email || undefined,
        phone: c.phone || undefined,
        mobile: c.mobile || undefined,
        title: c.title || undefined,
        companyId: c.company_id || undefined,
        companyName: c.company_name || undefined,
        contextId: c.context_id || undefined,
        contextName: c.context_name || undefined,
        linkedinUrl: c.linkedin_url || undefined,
        twitterUrl: c.twitter_url || undefined,
        website: c.website || undefined,
        address: c.address || undefined,
        city: c.city || undefined,
        state: c.state || undefined,
        country: c.country || undefined,
        postalCode: c.postal_code || undefined,
        birthday: c.birthday || undefined,
        avatarUrl: c.avatar_url || undefined,
        status: c.status,
        source: c.source || undefined,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
      total: totalResult?.count || 0,
    };
  }
);

// Get a single contact by ID
export const getContact = api<{id: number}, ContactResponse>(
  { auth: false, expose: true, method: "GET", path: "/crm/contacts/:id" },
  async (req) => {
    const contact = await db.queryRow<{
      id: number;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string | null;
      mobile: string | null;
      title: string | null;
      company_id: number | null;
      context_id: number | null;
      linkedin_url: string | null;
      twitter_url: string | null;
      website: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
      postal_code: string | null;
      birthday: string | null;
      avatar_url: string | null;
      status: string;
      source: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM crm_contacts WHERE id = ${req.id}
    `;

    if (!contact) {
      throw new Error("Contact not found");
    }

    // Get tags for this contact
    const tags = await db.queryAll<{name: string}>`
      SELECT t.name
      FROM crm_tags t
      INNER JOIN crm_contact_tags ct ON t.id = ct.tag_id
      WHERE ct.contact_id = ${req.id}
    `;

    return {
      contact: {
        id: contact.id,
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        mobile: contact.mobile || undefined,
        title: contact.title || undefined,
        companyId: contact.company_id || undefined,
        contextId: contact.context_id || undefined,
        linkedinUrl: contact.linkedin_url || undefined,
        twitterUrl: contact.twitter_url || undefined,
        website: contact.website || undefined,
        address: contact.address || undefined,
        city: contact.city || undefined,
        state: contact.state || undefined,
        country: contact.country || undefined,
        postalCode: contact.postal_code || undefined,
        birthday: contact.birthday || undefined,
        avatarUrl: contact.avatar_url || undefined,
        status: contact.status,
        source: contact.source || undefined,
        tags: tags.map(t => t.name),
        createdAt: contact.created_at,
        updatedAt: contact.updated_at,
      },
    };
  }
);

// Create a new contact
export const createContact = api<CreateContactRequest, ContactResponse>(
  { auth: false, expose: true, method: "POST", path: "/crm/contacts" },
  async (req) => {
    const result = await db.queryRow<{id: number}>`
      INSERT INTO crm_contacts (
        first_name, last_name, email, phone, mobile, title,
        company_id, context_id, linkedin_url, twitter_url, website,
        address, city, state, country, postal_code, birthday,
        status, source
      ) VALUES (
        ${req.firstName}, ${req.lastName}, ${req.email || null},
        ${req.phone || null}, ${req.mobile || null}, ${req.title || null},
        ${req.companyId || null}, ${req.contextId || null},
        ${req.linkedinUrl || null}, ${req.twitterUrl || null}, ${req.website || null},
        ${req.address || null}, ${req.city || null}, ${req.state || null},
        ${req.country || null}, ${req.postalCode || null}, ${req.birthday || null},
        ${req.status || 'prospect'}, ${req.source || null}
      )
      RETURNING id
    `;

    if (!result) {
      throw new Error("Failed to create contact");
    }

    // Handle tags if provided
    if (req.tags && req.tags.length > 0) {
      for (const tagName of req.tags) {
        // Create tag if it doesn't exist
        const tag = await db.queryRow<{id: number}>`
          INSERT INTO crm_tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

        // Link tag to contact
        if (tag) {
          await db.exec`
            INSERT INTO crm_contact_tags (contact_id, tag_id)
            VALUES (${result.id}, ${tag.id})
            ON CONFLICT DO NOTHING
          `;
        }
      }
    }

    return await getContact({ id: result.id });
  }
);

// Update a contact
export const updateContact = api<UpdateContactRequest, ContactResponse>(
  { auth: false, expose: true, method: "PUT", path: "/crm/contacts/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (req.firstName !== undefined) {
      paramCount++;
      updates.push(`first_name = $${paramCount}`);
      values.push(req.firstName);
    }

    if (req.lastName !== undefined) {
      paramCount++;
      updates.push(`last_name = $${paramCount}`);
      values.push(req.lastName);
    }

    if (req.email !== undefined) {
      paramCount++;
      updates.push(`email = $${paramCount}`);
      values.push(req.email || null);
    }

    if (req.phone !== undefined) {
      paramCount++;
      updates.push(`phone = $${paramCount}`);
      values.push(req.phone || null);
    }

    if (req.mobile !== undefined) {
      paramCount++;
      updates.push(`mobile = $${paramCount}`);
      values.push(req.mobile || null);
    }

    if (req.title !== undefined) {
      paramCount++;
      updates.push(`title = $${paramCount}`);
      values.push(req.title || null);
    }

    if (req.companyId !== undefined) {
      paramCount++;
      updates.push(`company_id = $${paramCount}`);
      values.push(req.companyId || null);
    }

    if (req.contextId !== undefined) {
      paramCount++;
      updates.push(`context_id = $${paramCount}`);
      values.push(req.contextId || null);
    }

    if (req.status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(req.status);
    }

    if (updates.length === 0) {
      throw new Error("No updates provided");
    }

    paramCount++;
    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    await db.rawExec(`
      UPDATE crm_contacts
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `, ...values);

    // Handle tags update if provided
    if (req.tags !== undefined) {
      // Remove existing tags
      await db.exec`DELETE FROM crm_contact_tags WHERE contact_id = ${req.id}`;

      // Add new tags
      for (const tagName of req.tags) {
        const tag = await db.queryRow<{id: number}>`
          INSERT INTO crm_tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

        if (tag) {
          await db.exec`
            INSERT INTO crm_contact_tags (contact_id, tag_id)
            VALUES (${req.id}, ${tag.id})
          `;
        }
      }
    }

    return await getContact({ id: req.id });
  }
);

// Delete a contact
export const deleteContact = api<{id: number}, {success: boolean}>(
  { auth: false, expose: true, method: "DELETE", path: "/crm/contacts/:id" },
  async (req) => {
    await db.exec`DELETE FROM crm_contacts WHERE id = ${req.id}`;
    return { success: true };
  }
);
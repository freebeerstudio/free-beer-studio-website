import { api } from "encore.dev/api";
import db from "../db";

export interface Context {
  id: number;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ListContextsResponse {
  contexts: Context[];
}

interface CreateContextRequest {
  name: string;
  description?: string;
  color?: string;
}

interface UpdateContextRequest {
  id: number;
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

interface ContextResponse {
  context: Context;
}

// List all contexts
export const listContexts = api<void, ListContextsResponse>(
  { auth: false, expose: true, method: "GET", path: "/crm/contexts" },
  async () => {
    const contexts = await db.queryAll<{
      id: number;
      name: string;
      description: string | null;
      color: string;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM crm_contexts ORDER BY name
    `;

    return {
      contexts: contexts.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || undefined,
        color: c.color,
        isActive: c.is_active,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
    };
  }
);

// Create a new context
export const createContext = api<CreateContextRequest, ContextResponse>(
  { auth: false, expose: true, method: "POST", path: "/crm/contexts" },
  async (req) => {
    const result = await db.queryRow<{
      id: number;
      name: string;
      description: string | null;
      color: string;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO crm_contexts (name, description, color)
      VALUES (${req.name}, ${req.description || null}, ${req.color || '#3B82F6'})
      RETURNING *
    `;

    if (!result) {
      throw new Error("Failed to create context");
    }

    return {
      context: {
        id: result.id,
        name: result.name,
        description: result.description || undefined,
        color: result.color,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    };
  }
);

// Update a context
export const updateContext = api<UpdateContextRequest, ContextResponse>(
  { auth: false, expose: true, method: "PUT", path: "/crm/contexts/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (req.name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(req.name);
    }

    if (req.description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(req.description || null);
    }

    if (req.color !== undefined) {
      paramCount++;
      updates.push(`color = $${paramCount}`);
      values.push(req.color);
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

    const result = await db.rawQueryRow<{
      id: number;
      name: string;
      description: string | null;
      color: string;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>(`
      UPDATE crm_contexts
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, ...values);

    if (!result) {
      throw new Error("Context not found");
    }

    return {
      context: {
        id: result.id,
        name: result.name,
        description: result.description || undefined,
        color: result.color,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    };
  }
);
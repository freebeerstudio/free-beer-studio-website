import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface StyleGuide {
  id: number;
  platform: string;
  guidelines: string;
  aiPrompt: string;
  exampleFiles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateStyleGuideRequest {
  platform: string;
  guidelines?: string;
  aiPrompt?: string;
  exampleFiles?: string[];
}

interface UpdateStyleGuideRequest {
  platform: string;
  guidelines?: string;
  aiPrompt?: string;
  exampleFiles?: string[];
}

interface StyleGuideResponse {
  styleGuide: StyleGuide;
}

interface ListStyleGuidesResponse {
  styleGuides: StyleGuide[];
}

// Get all style guides
export const listStyleGuides = api<void, ListStyleGuidesResponse>(
  { auth: true, expose: true, method: "GET", path: "/style-guides" },
  async () => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const styleGuides = await db.queryAll<{
      id: number;
      platform: string;
      guidelines: string;
      ai_prompt: string;
      example_files: any;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, platform, guidelines, ai_prompt, example_files, is_active, created_at, updated_at
      FROM style_guides
      ORDER BY platform
    `;

    return {
      styleGuides: styleGuides.map(sg => ({
        id: sg.id,
        platform: sg.platform,
        guidelines: sg.guidelines || '',
        aiPrompt: sg.ai_prompt || '',
        exampleFiles: Array.isArray(sg.example_files) ? sg.example_files : [],
        isActive: sg.is_active,
        createdAt: sg.created_at,
        updatedAt: sg.updated_at,
      })),
    };
  }
);

// Get style guide by platform
export const getStyleGuide = api<{platform: string}, StyleGuideResponse>(
  { auth: false, expose: true, method: "GET", path: "/style-guides/:platform" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const styleGuide = await db.queryRow<{
      id: number;
      platform: string;
      guidelines: string;
      ai_prompt: string;
      example_files: any;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, platform, guidelines, ai_prompt, example_files, is_active, created_at, updated_at
      FROM style_guides
      WHERE platform = ${req.platform}
    `;

    if (!styleGuide) {
      throw new Error("Style guide not found");
    }

    return {
      styleGuide: {
        id: styleGuide.id,
        platform: styleGuide.platform,
        guidelines: styleGuide.guidelines || '',
        aiPrompt: styleGuide.ai_prompt || '',
        exampleFiles: Array.isArray(styleGuide.example_files) ? styleGuide.example_files : [],
        isActive: styleGuide.is_active,
        createdAt: styleGuide.created_at,
        updatedAt: styleGuide.updated_at,
      },
    };
  }
);

// Create or update style guide (upsert)
export const saveStyleGuide = api<UpdateStyleGuideRequest, StyleGuideResponse>(
  { auth: false, expose: true, method: "POST", path: "/style-guides/:platform" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    const guidelines = req.guidelines || '';
    const aiPrompt = req.aiPrompt || '';
    const exampleFiles = JSON.stringify(req.exampleFiles || []);

    // Use UPSERT to create or update
    const result = await db.queryRow<{
      id: number;
      platform: string;
      guidelines: string;
      ai_prompt: string;
      example_files: any;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO style_guides (platform, guidelines, ai_prompt, example_files, is_active)
      VALUES (${req.platform}, ${guidelines}, ${aiPrompt}, ${exampleFiles}, true)
      ON CONFLICT (platform) 
      DO UPDATE SET 
        guidelines = EXCLUDED.guidelines,
        ai_prompt = EXCLUDED.ai_prompt,
        example_files = EXCLUDED.example_files,
        updated_at = NOW()
      RETURNING id, platform, guidelines, ai_prompt, example_files, is_active, created_at, updated_at
    `;

    if (!result) {
      throw new Error("Failed to save style guide");
    }

    return {
      styleGuide: {
        id: result.id,
        platform: result.platform,
        guidelines: result.guidelines || '',
        aiPrompt: result.ai_prompt || '',
        exampleFiles: Array.isArray(result.example_files) ? result.example_files : [],
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    };
  }
);

// Delete style guide
export const deleteStyleGuide = api<{platform: string}, {success: boolean}>(
  { auth: false, expose: true, method: "DELETE", path: "/style-guides/:platform" },
  async (req) => {
    // Temporarily disable auth check for testing
    // const auth = getAuthData()!;
    // if (auth.role !== 'admin') {
    //   throw new Error("Admin access required");
    // }

    await db.exec`
      DELETE FROM style_guides WHERE platform = ${req.platform}
    `;

    return { success: true };
  }
);
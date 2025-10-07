import { api } from "encore.dev/api";
import db from "../db";

export interface LearningPath {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  difficultyLevel: string | null;
  estimatedHours: number | null;
  isPublished: boolean;
  sortOrder: number;
  courseCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLearningPathRequest {
  title: string;
  description?: string;
  coverImageUrl?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours?: number;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateLearningPathRequest {
  id: number;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours?: number;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface AddCourseToPathRequest {
  learningPathId: number;
  courseId: number;
  sortOrder?: number;
}

export interface RemoveCourseFromPathRequest {
  learningPathId: number;
  courseId: number;
}

export interface ListLearningPathsResponse {
  paths: LearningPath[];
}

export const listPaths = api<void, ListLearningPathsResponse>(
  { expose: true, method: "GET", path: "/lms/paths" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      difficulty_level: string | null;
      estimated_hours: number | null;
      is_published: boolean;
      sort_order: number;
      course_count: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT 
        lp.*,
        COUNT(lpc.course_id)::text as course_count
      FROM learning_paths lp
      LEFT JOIN learning_path_courses lpc ON lp.id = lpc.learning_path_id
      GROUP BY lp.id
      ORDER BY lp.sort_order ASC, lp.created_at DESC
    `;

    return {
      paths: rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        coverImageUrl: row.cover_image_url,
        difficultyLevel: row.difficulty_level,
        estimatedHours: row.estimated_hours,
        isPublished: row.is_published,
        sortOrder: row.sort_order,
        courseCount: parseInt(row.course_count, 10),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }
);

export const getPath = api<{ id: number }, LearningPath>(
  { expose: true, method: "GET", path: "/lms/paths/:id" },
  async ({ id }) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      difficulty_level: string | null;
      estimated_hours: number | null;
      is_published: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM learning_paths WHERE id = ${id}
    `;

    if (!row) {
      throw new Error("Learning path not found");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      coverImageUrl: row.cover_image_url,
      difficultyLevel: row.difficulty_level,
      estimatedHours: row.estimated_hours,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

export const createPath = api<CreateLearningPathRequest, LearningPath>(
  { expose: true, method: "POST", path: "/lms/paths" },
  async (req) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      difficulty_level: string | null;
      estimated_hours: number | null;
      is_published: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO learning_paths (
        title, description, cover_image_url, difficulty_level, 
        estimated_hours, is_published, sort_order
      )
      VALUES (
        ${req.title}, 
        ${req.description || null}, 
        ${req.coverImageUrl || null}, 
        ${req.difficultyLevel || null},
        ${req.estimatedHours || null},
        ${req.isPublished ?? false},
        ${req.sortOrder ?? 0}
      )
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to create learning path");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      coverImageUrl: row.cover_image_url,
      difficultyLevel: row.difficulty_level,
      estimatedHours: row.estimated_hours,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

export const updatePath = api<UpdateLearningPathRequest, LearningPath>(
  { expose: true, method: "PUT", path: "/lms/paths/:id" },
  async (req) => {
    const existing = await db.queryRow`
      SELECT * FROM learning_paths WHERE id = ${req.id}
    `;

    if (!existing) {
      throw new Error("Learning path not found");
    }

    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      difficulty_level: string | null;
      estimated_hours: number | null;
      is_published: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      UPDATE learning_paths
      SET 
        title = COALESCE(${req.title || null}, title),
        description = COALESCE(${req.description || null}, description),
        cover_image_url = COALESCE(${req.coverImageUrl || null}, cover_image_url),
        difficulty_level = COALESCE(${req.difficultyLevel || null}, difficulty_level),
        estimated_hours = COALESCE(${req.estimatedHours || null}, estimated_hours),
        is_published = COALESCE(${req.isPublished ?? null}, is_published),
        sort_order = COALESCE(${req.sortOrder ?? null}, sort_order),
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to update learning path");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      coverImageUrl: row.cover_image_url,
      difficultyLevel: row.difficulty_level,
      estimatedHours: row.estimated_hours,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

export const deletePath = api<{ id: number }, void>(
  { expose: true, method: "DELETE", path: "/lms/paths/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM learning_paths WHERE id = ${id}`;
  }
);

export const addCourseToPath = api<AddCourseToPathRequest, void>(
  { expose: true, method: "POST", path: "/lms/paths/add-course" },
  async (req) => {
    await db.exec`
      INSERT INTO learning_path_courses (learning_path_id, course_id, sort_order)
      VALUES (${req.learningPathId}, ${req.courseId}, ${req.sortOrder ?? 0})
      ON CONFLICT (learning_path_id, course_id) DO UPDATE
      SET sort_order = ${req.sortOrder ?? 0}
    `;
  }
);

export const removeCourseFromPath = api<RemoveCourseFromPathRequest, void>(
  { expose: true, method: "POST", path: "/lms/paths/remove-course" },
  async (req) => {
    await db.exec`
      DELETE FROM learning_path_courses
      WHERE learning_path_id = ${req.learningPathId}
      AND course_id = ${req.courseId}
    `;
  }
);

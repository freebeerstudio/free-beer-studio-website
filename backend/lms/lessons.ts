import { api } from "encore.dev/api";
import db from "../db";

export interface Lesson {
  id: number;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  durationMinutes: number | null;
  lessonType: string;
  isPublished: boolean;
  sortOrder: number;
  courseCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  durationMinutes?: number;
  lessonType?: 'video' | 'article' | 'quiz' | 'exercise' | 'project';
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateLessonRequest {
  id: number;
  title?: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  durationMinutes?: number;
  lessonType?: 'video' | 'article' | 'quiz' | 'exercise' | 'project';
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListLessonsResponse {
  lessons: Lesson[];
}

export const listLessons = api<void, ListLessonsResponse>(
  { expose: true, method: "GET", path: "/lms/lessons" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      title: string;
      description: string | null;
      content: string | null;
      video_url: string | null;
      duration_minutes: number | null;
      lesson_type: string;
      is_published: boolean;
      sort_order: number;
      course_count: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT 
        l.*,
        COUNT(cl.course_id)::text as course_count
      FROM lessons l
      LEFT JOIN course_lessons cl ON l.id = cl.lesson_id
      GROUP BY l.id
      ORDER BY l.sort_order ASC, l.created_at DESC
    `;

    return {
      lessons: rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        content: row.content,
        videoUrl: row.video_url,
        durationMinutes: row.duration_minutes,
        lessonType: row.lesson_type,
        isPublished: row.is_published,
        sortOrder: row.sort_order,
        courseCount: parseInt(row.course_count, 10),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }
);

export const getLesson = api<{ id: number }, Lesson>(
  { expose: true, method: "GET", path: "/lms/lessons/:id" },
  async ({ id }) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      content: string | null;
      video_url: string | null;
      duration_minutes: number | null;
      lesson_type: string;
      is_published: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM lessons WHERE id = ${id}
    `;

    if (!row) {
      throw new Error("Lesson not found");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      videoUrl: row.video_url,
      durationMinutes: row.duration_minutes,
      lessonType: row.lesson_type,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

export const createLesson = api<CreateLessonRequest, Lesson>(
  { expose: true, method: "POST", path: "/lms/lessons" },
  async (req) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      content: string | null;
      video_url: string | null;
      duration_minutes: number | null;
      lesson_type: string;
      is_published: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO lessons (
        title, description, content, video_url, duration_minutes,
        lesson_type, is_published, sort_order
      )
      VALUES (
        ${req.title}, 
        ${req.description || null}, 
        ${req.content || null}, 
        ${req.videoUrl || null},
        ${req.durationMinutes || null},
        ${req.lessonType || 'video'},
        ${req.isPublished ?? false},
        ${req.sortOrder ?? 0}
      )
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to create lesson");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      videoUrl: row.video_url,
      durationMinutes: row.duration_minutes,
      lessonType: row.lesson_type,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

export const updateLesson = api<UpdateLessonRequest, Lesson>(
  { expose: true, method: "PUT", path: "/lms/lessons/:id" },
  async (req) => {
    const existing = await db.queryRow`
      SELECT * FROM lessons WHERE id = ${req.id}
    `;

    if (!existing) {
      throw new Error("Lesson not found");
    }

    const row = await db.queryRow<{
      id: number;
      title: string;
      description: string | null;
      content: string | null;
      video_url: string | null;
      duration_minutes: number | null;
      lesson_type: string;
      is_published: boolean;
      sort_order: number;
      created_at: Date;
      updated_at: Date;
    }>`
      UPDATE lessons
      SET 
        title = COALESCE(${req.title || null}, title),
        description = COALESCE(${req.description || null}, description),
        content = COALESCE(${req.content || null}, content),
        video_url = COALESCE(${req.videoUrl || null}, video_url),
        duration_minutes = COALESCE(${req.durationMinutes || null}, duration_minutes),
        lesson_type = COALESCE(${req.lessonType || null}, lesson_type),
        is_published = COALESCE(${req.isPublished ?? null}, is_published),
        sort_order = COALESCE(${req.sortOrder ?? null}, sort_order),
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to update lesson");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      videoUrl: row.video_url,
      durationMinutes: row.duration_minutes,
      lessonType: row.lesson_type,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);

export const deleteLesson = api<{ id: number }, void>(
  { expose: true, method: "DELETE", path: "/lms/lessons/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM lessons WHERE id = ${id}`;
  }
);

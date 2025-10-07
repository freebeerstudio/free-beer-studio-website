import { api } from "encore.dev/api";
import db from "../db";

export interface Course {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  difficultyLevel: string | null;
  estimatedHours: number | null;
  isPublished: boolean;
  sortOrder: number;
  lessonCount?: number;
  pathCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  coverImageUrl?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours?: number;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateCourseRequest {
  id: number;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours?: number;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface AddLessonToCourseRequest {
  courseId: number;
  lessonId: number;
  sortOrder?: number;
}

export interface RemoveLessonFromCourseRequest {
  courseId: number;
  lessonId: number;
}

export interface ListCoursesResponse {
  courses: Course[];
}

export const listCourses = api<void, ListCoursesResponse>(
  { expose: true, method: "GET", path: "/lms/courses" },
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
      lesson_count: string;
      path_count: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT 
        c.*,
        COUNT(DISTINCT cl.lesson_id)::text as lesson_count,
        COUNT(DISTINCT lpc.learning_path_id)::text as path_count
      FROM courses c
      LEFT JOIN course_lessons cl ON c.id = cl.course_id
      LEFT JOIN learning_path_courses lpc ON c.id = lpc.course_id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.created_at DESC
    `;

    return {
      courses: rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        coverImageUrl: row.cover_image_url,
        difficultyLevel: row.difficulty_level,
        estimatedHours: row.estimated_hours,
        isPublished: row.is_published,
        sortOrder: row.sort_order,
        lessonCount: parseInt(row.lesson_count, 10),
        pathCount: parseInt(row.path_count, 10),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }
);

export const getCourse = api<{ id: number }, Course>(
  { expose: true, method: "GET", path: "/lms/courses/:id" },
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
      SELECT * FROM courses WHERE id = ${id}
    `;

    if (!row) {
      throw new Error("Course not found");
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

export const createCourse = api<CreateCourseRequest, Course>(
  { expose: true, method: "POST", path: "/lms/courses" },
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
      INSERT INTO courses (
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
      throw new Error("Failed to create course");
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

export const updateCourse = api<UpdateCourseRequest, Course>(
  { expose: true, method: "PUT", path: "/lms/courses/:id" },
  async (req) => {
    const existing = await db.queryRow`
      SELECT * FROM courses WHERE id = ${req.id}
    `;

    if (!existing) {
      throw new Error("Course not found");
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
      UPDATE courses
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
      throw new Error("Failed to update course");
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

export const deleteCourse = api<{ id: number }, void>(
  { expose: true, method: "DELETE", path: "/lms/courses/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM courses WHERE id = ${id}`;
  }
);

export const addLessonToCourse = api<AddLessonToCourseRequest, void>(
  { expose: true, method: "POST", path: "/lms/courses/add-lesson" },
  async (req) => {
    await db.exec`
      INSERT INTO course_lessons (course_id, lesson_id, sort_order)
      VALUES (${req.courseId}, ${req.lessonId}, ${req.sortOrder ?? 0})
      ON CONFLICT (course_id, lesson_id) DO UPDATE
      SET sort_order = ${req.sortOrder ?? 0}
    `;
  }
);

export const removeLessonFromCourse = api<RemoveLessonFromCourseRequest, void>(
  { expose: true, method: "POST", path: "/lms/courses/remove-lesson" },
  async (req) => {
    await db.exec`
      DELETE FROM course_lessons
      WHERE course_id = ${req.courseId}
      AND lesson_id = ${req.lessonId}
    `;
  }
);

import { api } from "encore.dev/api";
import db from "../db";

interface Project {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  externalUrl: string | null;
  isFeatured: boolean;
}

interface ListProjectsResponse {
  projects: Project[];
}

// Retrieves all portfolio projects for the public website.
export const listProjects = api<void, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/portfolio" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      gallery: any;
      external_url: string | null;
      is_featured: boolean;
    }>`
      SELECT id, title, description, cover_image_url, gallery, external_url, is_featured
      FROM projects
      ORDER BY is_featured DESC, sort_order ASC, created_at DESC
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
      })),
    };
  }
);

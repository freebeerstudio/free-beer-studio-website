import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";
import db from "../db";

// Create buckets for different content types
const images = new Bucket("content-images", { public: true });

interface GetUploadUrlRequest {
  filename: string;
  contentType: string;
  category: "pricing" | "project" | "blog" | "profile" | "styleguide";
}

interface GetUploadUrlResponse {
  uploadUrl: string;
  fileId: string;
  storageName: string;
}

interface ConfirmUploadRequest {
  fileId: string;
  size: number;
}

interface ConfirmUploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
}

interface FileRecord {
  id: string;
  originalName: string;
  storageName: string;
  url: string;
  contentType: string;
  size: number;
  category: string;
  createdAt: Date;
}

// Get a signed upload URL for client-side uploads
export const getUploadUrl = api<GetUploadUrlRequest, GetUploadUrlResponse>(
  { expose: true, method: "POST", path: "/uploads/url" },
  async (req) => {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = req.filename.split('.').pop() || '';
      const storageName = `${req.category}/${timestamp}-${randomString}.${extension}`;

      console.log('Generating signed URL for:', storageName);

      // Get signed upload URL
      const { url: uploadUrl } = await images.signedUploadUrl(storageName, {
        ttl: 3600, // 1 hour
      });

      console.log('Signed URL generated successfully');

      // Pre-create database record
      const result = await db.queryRow<{id: string}>`
        INSERT INTO files (original_name, storage_name, url, content_type, size, category, uploaded)
        VALUES (${req.filename}, ${storageName}, ${images.publicUrl(storageName)}, ${req.contentType}, 0, ${req.category}, false)
        RETURNING id
      `;

      console.log('Database record created:', result?.id);

      return {
        uploadUrl,
        fileId: result!.id,
        storageName,
      };
    } catch (error) {
      console.error('Error generating upload URL:', error);
      throw error;
    }
  }
);

// Confirm upload completion and update file size
export const confirmUpload = api<ConfirmUploadRequest, ConfirmUploadResponse>(
  { expose: true, method: "POST", path: "/uploads/confirm" },
  async (req) => {
    // Update file record with actual size and mark as uploaded
    await db.rawExec(`
      UPDATE files 
      SET size = $1, uploaded = true, updated_at = NOW() 
      WHERE id = $2
    `, req.size, req.fileId);

    // Get updated file record
    const file = await db.queryRow<{
      id: string;
      original_name: string;
      url: string;
      size: number;
    }>`
      SELECT id, original_name, url, size
      FROM files
      WHERE id = ${req.fileId}
    `;

    if (!file) {
      throw new Error("File not found");
    }

    return {
      id: file.id,
      url: file.url,
      filename: file.original_name,
      size: file.size,
    };
  }
);

// Get file metadata
export const getFile = api<{id: string}, FileRecord>(
  { expose: true, method: "GET", path: "/uploads/:id" },
  async (req) => {
    const file = await db.queryRow<{
      id: string;
      original_name: string;
      storage_name: string;
      url: string;
      content_type: string;
      size: number;
      category: string;
      created_at: Date;
    }>`
      SELECT id, original_name, storage_name, url, content_type, size, category, created_at
      FROM files
      WHERE id = ${req.id}
    `;

    if (!file) {
      throw new Error("File not found");
    }

    return {
      id: file.id,
      originalName: file.original_name,
      storageName: file.storage_name,
      url: file.url,
      contentType: file.content_type,
      size: file.size,
      category: file.category,
      createdAt: file.created_at,
    };
  }
);

// Delete a file
export const deleteFile = api<{id: string}, {success: boolean}>(
  { expose: true, method: "DELETE", path: "/uploads/:id" },
  async (req) => {
    // Get file metadata first
    const file = await db.queryRow<{storage_name: string}>`
      SELECT storage_name FROM files WHERE id = ${req.id}
    `;

    if (file) {
      // Remove from object storage
      try {
        await images.remove(file.storage_name);
      } catch (error) {
        console.error("Failed to remove file from storage:", error);
      }
    }

    // Remove from database
    await db.rawExec(`DELETE FROM files WHERE id = $1`, req.id);

    return { success: true };
  }
);

// List files by category
export const listFiles = api<{category?: string}, {files: FileRecord[]}>(
  { expose: true, method: "GET", path: "/uploads" },
  async (req) => {
    const files = req.category 
      ? await db.queryAll<{
          id: string;
          original_name: string;
          storage_name: string;
          url: string;
          content_type: string;
          size: number;
          category: string;
          created_at: Date;
        }>`
          SELECT id, original_name, storage_name, url, content_type, size, category, created_at 
          FROM files WHERE category = ${req.category} ORDER BY created_at DESC`
      : await db.queryAll<{
          id: string;
          original_name: string;
          storage_name: string;
          url: string;
          content_type: string;
          size: number;
          category: string;
          created_at: Date;
        }>`
          SELECT id, original_name, storage_name, url, content_type, size, category, created_at 
          FROM files ORDER BY created_at DESC`;

    return {
      files: files.map(file => ({
        id: file.id,
        originalName: file.original_name,
        storageName: file.storage_name,
        url: file.url,
        contentType: file.content_type,
        size: file.size,
        category: file.category,
        createdAt: file.created_at,
      })),
    };
  }
);
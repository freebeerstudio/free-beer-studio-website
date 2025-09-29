import { api } from "encore.dev/api";
import db from "../db";

interface PricingItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  features: string[];
  isFeatured: boolean;
  sortOrder: number;
}

interface ListPricingResponse {
  items: PricingItem[];
}

// Retrieves all pricing items for the public website.
export const listPricing = api<void, ListPricingResponse>(
  { expose: true, method: "GET", path: "/pricing" },
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
    }>`
      SELECT id, title, description, image_url, price, features, is_featured, sort_order
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
      })),
    };
  }
);

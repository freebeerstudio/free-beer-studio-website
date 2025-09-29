import { api } from "encore.dev/api";
import db from "../db";
import { APIError } from "encore.dev/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Authenticates a user and returns a session token.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // For demo purposes, create simple auth
    // In production, use proper password hashing
    const user = await db.queryRow<{id: string, email: string, role: string}>`
      SELECT id, email, role FROM users WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.unauthenticated("invalid credentials");
    }

    // Create simple token (use proper JWT in production)
    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
);

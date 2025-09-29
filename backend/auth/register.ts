import { api } from "encore.dev/api";
import db from "../db";
import { APIError } from "encore.dev/api";

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Registers a new user account.
export const register = api<RegisterRequest, RegisterResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    // Check if user already exists
    const existingUser = await db.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("user with this email already exists");
    }

    // Create new user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Insert user
    await db.exec`
      INSERT INTO users (id, email, role, auth_provider)
      VALUES (${userId}, ${req.email}, 'user', 'email')
    `;

    // Create profile
    await db.exec`
      INSERT INTO profiles (user_id, plan_tier)
      VALUES (${userId}, 'free')
    `;

    // Create simple token
    const token = Buffer.from(`${userId}:${req.email}`).toString('base64');

    return {
      token,
      user: {
        id: userId,
        email: req.email,
        role: 'user',
      },
    };
  }
);

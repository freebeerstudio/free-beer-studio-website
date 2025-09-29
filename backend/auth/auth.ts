import { authHandler } from "encore.dev/auth";
import { Header, Cookie, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import db from "../db";

const jwtSecret = secret("JWTSecret");

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string;
  role: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const token = params.authorization?.replace("Bearer ", "") ?? params.session?.value;
    
    if (!token) {
      throw APIError.unauthenticated("missing authentication token");
    }

    try {
      // For demo purposes, we'll use a simple token format
      // In production, use proper JWT verification
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userID, email] = decoded.split(':');
      
      if (!userID || !email) {
        throw APIError.unauthenticated("invalid token format");
      }

      // Verify user exists in database
      const user = await db.queryRow<{id: string, email: string, role: string}>`
        SELECT id, email, role FROM users WHERE id = ${userID} AND email = ${email}
      `;

      if (!user) {
        throw APIError.unauthenticated("user not found");
      }

      return {
        userID: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid authentication token", err as Error);
    }
  }
);

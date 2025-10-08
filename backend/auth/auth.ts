import { createClerkClient, verifyToken } from "@clerk/backend";
import { authHandler } from "encore.dev/auth";
import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { secret } from "encore.dev/config";

const clerkSecretKey = secret("ClerkSecretKey");
const clerkClient = createClerkClient({ secretKey: clerkSecretKey() });

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  imageUrl: string;
  email: string | null;
  role: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: clerkSecretKey(),
      });

      const user = await clerkClient.users.getUser(verifiedToken.sub);
      const role = (user.publicMetadata?.role as string) ?? 'user';
      return {
        userID: user.id,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress ?? null,
        role,
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token", err as Error);
    }
  }
);

export const gw = new Gateway({ authHandler: auth });

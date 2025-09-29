import { api } from "encore.dev/api";
import db from "../db";

interface ContactRequest {
  name: string;
  email: string;
  topic: "support" | "quote" | "question";
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

// Submits a contact form and sends notification email.
export const submitContact = api<ContactRequest, ContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    // Store in database
    await db.exec`
      INSERT INTO contact_submissions (name, email, topic, message, status)
      VALUES (${req.name}, ${req.email}, ${req.topic}, ${req.message}, 'new')
    `;

    // TODO: Send email notification to hello@freebeer.ai
    // This would integrate with Resend or SendGrid

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  }
);

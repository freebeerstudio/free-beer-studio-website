import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface DashboardKPIs {
  traffic: number;
  newsletterSignups: number;
  leads: number;
  contentThroughput: number;
}

interface IdeaEngineCounts {
  newIdeas: number;
  postsForApproval: number;
  scheduled: number;
}

interface DashboardResponse {
  kpis: DashboardKPIs;
  ideaEngine: IdeaEngineCounts;
}

// Retrieves dashboard overview data for admin users.
export const getDashboard = api<void, DashboardResponse>(
  { auth: true, expose: true, method: "GET", path: "/admin/dashboard" },
  async () => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'admin') {
      throw new Error("Admin access required");
    }

    // Get KPIs
    const [
      leadCount,
      newIdeasCount,
      approvalCount,
      scheduledCount,
    ] = await Promise.all([
      db.queryRow<{count: number}>`SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'`,
      // New Ideas: Ideas that haven't been approved yet (status = 'new')
      db.queryRow<{count: number}>`SELECT COUNT(*) as count FROM ideas WHERE status = 'new'`,
      // Posts for Approval: Drafts that have been written and are awaiting final approval
      db.queryRow<{count: number}>`SELECT COUNT(*) as count FROM idea_platform_selections WHERE status = 'draft' AND draft_content IS NOT NULL`,
      // Scheduled: Posts that have been approved and are scheduled for posting
      db.queryRow<{count: number}>`SELECT COUNT(*) as count FROM idea_platform_selections WHERE status = 'scheduled'`,
    ]);

    return {
      kpis: {
        traffic: 1250, // Placeholder - would come from analytics
        newsletterSignups: 89, // Placeholder
        leads: leadCount?.count || 0,
        contentThroughput: 24, // Placeholder
      },
      ideaEngine: {
        newIdeas: newIdeasCount?.count || 0,
        postsForApproval: approvalCount?.count || 0,
        scheduled: scheduledCount?.count || 0,
      },
    };
  }
);

import { Router, type Request, type Response } from "express";
import { db, subscriptions } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const PLAN_LIMITS = {
  free: {
    projects: 3,
    ai_generations: 5,
    features: ['basic_2d', 'basic_3d']
  },
  pro: {
    projects: Infinity,
    ai_generations: 100,
    features: ['basic_2d', 'basic_3d', 'ai_2d_to_3d', 'climate_analysis', 'furniture_placement', 'cost_estimation', 'advanced_rendering']
  },
  enterprise: {
    projects: Infinity,
    ai_generations: Infinity,
    features: ['basic_2d', 'basic_3d', 'ai_2d_to_3d', 'climate_analysis', 'furniture_placement', 'cost_estimation', 'advanced_rendering', 'team_collab', 'analytics']
  }
};

router.get("/status", async (req: Request, res: Response): Promise<void> => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const rows = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    const sub = rows[0] || { plan: 'free', status: 'active', aiGenerationsUsed: 0, projectsUsed: 0 };

    const limits = PLAN_LIMITS[sub.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

    res.json({
      plan: sub.plan,
      status: sub.status,
      usage: {
        ai_generations: sub.aiGenerationsUsed || 0,
        projects: sub.projectsUsed || 0
      },
      entitlements: limits
    });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

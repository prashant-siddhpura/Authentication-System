import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  requireAuth,
  requireRole("ADMIN"),
  (_req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

export default router;

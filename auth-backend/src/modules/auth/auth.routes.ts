import { Router } from "express";
import { register, login, refresh, logout, googleOAuthCallback } from "./auth.controller";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleOAuthCallback
);
//temparory route for checking oauth:
router.get("/oauth-success", (req, res) => {
  res.json({
    message: "OAuth success ✅",
    token: req.query.token
  });
});
export default router;

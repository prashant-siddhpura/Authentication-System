import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import prisma from "./prisma";
import authRoutes from "./modules/auth/auth.routes";
import "./modules/auth/google.strategy";
import adminRoutes from "./modules/admin/admin.routes";
import { requireAuth } from "./middlewares/auth.middleware";


const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000", // React app (we can change later)
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());


app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Auth System API 🚀" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Auth API is running ✅" });
});
app.get("/test-db", async (_req, res) => {
  const usersCount = await prisma.user.count();
  res.json({ usersCount });
});
app.get("/profile", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated ✅",
    user: (req as any).user
  });
});

export default app;

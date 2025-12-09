import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  handleOAuthLogin,
} from "./auth.service";

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const user = await registerUser(parsed.data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.flatten());
    }

    const { accessToken, refreshToken, user } = await loginUser(parsed.data);

    // ✅ httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      accessToken,
      user,
    });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const accessToken = await refreshAccessToken(refreshToken);
    return res.json({ accessToken });
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  // Cookie might already be missing (logout twice, etc.)
  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  // Clear cookie on client
  res.clearCookie("refreshToken", {
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
}

export async function googleOAuthCallback(req: Request, res: Response) {
  try {
    const user = req.user as any;

    const { accessToken, refreshToken } =
      await handleOAuthLogin(user.id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/"
    });

    return res.redirect(
      // `http://localhost:3000/oauth-success?token=${accessToken}` //react frontend
      //temparory redirect url for checking:
      `/auth/oauth-success?token=${accessToken}`
    );
  } catch (err) {
    return res.status(500).json({ message: "OAuth login failed" });
  }
}
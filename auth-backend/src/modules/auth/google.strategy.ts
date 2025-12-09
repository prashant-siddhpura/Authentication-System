import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../../prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const primaryEmail = profile.emails?.[0]?.value;

        if (!primaryEmail) {
          return done(new Error("Google account has no email"), undefined);
        }

        const email: string = primaryEmail;

        if (!email) {
          return done(new Error("No email from Google"), undefined);
        }

        // ✅ Check if Google account already linked
        let oauthAccount = await prisma.oAuthAccount.findUnique({
          where: {
            provider_providerId: {
              provider: "GOOGLE",
              providerId: profile.id,
            },
          },
        });

        if (oauthAccount) {
          const user = await prisma.user.findUnique({
            where: { id: oauthAccount.userId },
          });
          if (!user) {
            return done(null, false); // ✅ user deleted edge case
          }
          return done(null, user);
        }

        // ✅ Check if email exists
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              isEmailVerified: true,
            },
          });
        }

        // ✅ Link OAuth account
        await prisma.oAuthAccount.create({
          data: {
            provider: "GOOGLE",
            providerId: profile.id,
            userId: user.id,
          },
        });

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

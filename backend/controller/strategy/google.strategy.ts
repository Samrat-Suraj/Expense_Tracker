import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import EnvVars from "../../config/EnvVars";
import { User } from "../../model/user.model";
import { Request } from "express";

passport.use(
  new GoogleStrategy(
    {
      clientID: EnvVars.GOOGLE_CLIENT_ID || "",
      clientSecret: EnvVars.GOOGLE_CLIENT_SECRET || "",
      callbackURL: EnvVars.GOOGLE_CALLBACK_URL || "",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: (error: any, user?: any | false) => void
    ) => {
      const { emails, photos, displayName, id } = profile;

      try {
        if (!emails || emails.length === 0) {
          return cb(new Error("No email found in Google profile"));
        }

        const email = emails[0].value;

        // ✅ 1. Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
      
          if (!user.googleId) {
            user.googleId = id;
            user.isVerified = true;
            await user.save();
          }

          return cb(null, user);
        }

        // ✅ 3. Create new user
        const newUser = new User({
          googleId: id,
          fullName: displayName,
          email,
          isVerified: true,
          provider: "google", // recommended
        });

        await newUser.save();

        return cb(null, newUser);

      } catch (error) {
        console.error("Google Auth Error:", error);
        return cb(error);
      }
    }
  )
);

export default passport;
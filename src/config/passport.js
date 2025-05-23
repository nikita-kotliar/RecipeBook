import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../db/models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/users/google/callback`


    },
    async (_, __, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }


        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          photo: profile.photos[0].value,
        });

        return done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
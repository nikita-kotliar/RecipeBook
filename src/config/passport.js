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
        const email = profile.emails[0].value;
    
        let user = await User.findOne({ email });
    
        if (user) {
          let updated = false;
    
          if (!user.googleId) {
            user.googleId = profile.id;
            updated = true;
          }
    
          if (!user.photo && profile.photos?.[0]?.value) {
            user.photo = profile.photos[0].value;
            updated = true;
          }
    
          if (!user.name && profile.displayName) {
            user.name = profile.displayName;
            updated = true;
          }
    
          if (!user.verify) {
            user.verify = true;
            updated = true;
          }
    
          if (updated) {
            await user.save();
          }
    
          return done(null, user);
        }
    
        const newUser = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
          photo: profile.photos?.[0]?.value,
          verify: true,
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
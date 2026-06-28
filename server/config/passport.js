const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true // Trust reverse proxy (e.g. Render)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by email
        let user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
        
        if (!user) {
          // If no user exists, create a new one
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value.toLowerCase(),
            isVerified: true, // Google emails are already verified
          });
          await user.save({ validateBeforeSave: false }); // Skip password validation if we make it optional
        }
        
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;

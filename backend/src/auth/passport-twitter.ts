import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser((obj: undefined, done) => {
  done(null, obj);
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
      callbackURL:
        process.env.TWITTER_CALLBACK_URL ||
        `http://localhost:${process.env.PORT}/auth/twitter/callback`,
    },
    async (token, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

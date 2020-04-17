const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); //one argument is to fetch schema out of mongoose

passport.serializeUser((user, done) => {
  //convert the profile ID from google into an identifying piece of info
  done(null, user.id); // user.id refers to mongoDB's generated ID
});

passport.deserializeUser((id, done) => {
  //turn an ID into a mongoose model instance
  User.findById(id).then(user => {
    //find user by ID in mongoDB
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }) // check if there is existing user record in mongoDB
        .then(existingUser => {
          if (existingUser) {
            // we already have a record with the given profile ID
            done(null, existingUser);
          } else {
            // we don't have a user record with this ID make a new record
            new User({ googleId: profile.id }) // create new user using model instance and save to mongoDB
              .save()
              .then(user => done(null, user));
          }
        });
    }
  )
); //new instance of googlestrategy config, tell passport module to use this strat

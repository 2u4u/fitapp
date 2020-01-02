const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");
// const createHandleId = require("../utils/createHandleId");

module.exports = passport => {
  //generate a token to set inside the cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //passport takes token and turn it into a user mongoose model class
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        // callbackURL: "https://localhost:5000/api/users/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        User
          //check if such email exist in any strategy
          .findOne({ email })
          .then(user => {
            if (user) {
              //if user already exist then add in google part his info 
              //aka connect with facebook/local or update google itself
              user.google.email = profile.emails[0].value;
              user.google.name = profile.name.givenName + ' ' + profile.name.familyName;
              user.save();

              return done(null, user);
            } else {
              //if user doesn't exist create user
              const newUser = new User({
                name: profile.name.givenName,
                email,
                google: {
                  name: profile.name.givenName,
                  email
                },
              });

              //save google user to db user
              newUser
                .save()
                .then(user => {
                  console.log("passport ggl save user -> ", user)
                })
                .catch(err => console.log("passport ggl save err -> ", err))

              return done(null, newUser);
            };
          })
          .catch(err => console.log("Passport err ->  ", err));
      }
    ));
};

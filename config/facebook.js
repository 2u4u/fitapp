const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");
// const createHandleId = require("../utils/createHandleId");

module.exports = passport => {
  //user.id is MONGO id
  //generate a token to set inside the cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //passport takes token and turn it into a user mongoose model class
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        // callbackURL: "https://localhost:5000/api/users/auth/facebook/callback/messages",
        profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        User
          //check if such email exist in any strategy
          .findOne({ email })
          .then(user => {
            if (user) {
              //if user already exist then add in facebook part his info 
              //aka connect with google/local or update facebook itself
              user.facebook.id = profile.id;
              user.facebook.token = accessToken;
              user.facebook.email = profile.emails[0].value;
              user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              user.save();

              return done(null, user);
            } else {
              //if user doesn't exist create user
              const newUser = new User({
                name: profile.name.givenName,
                email,
                facebook: {
                  id: profile.id,
                  token: accessToken,
                  name: profile.name.givenName,
                  email
                },
              });

              //save facebook user to db user
              newUser
                .save()
                .then(user => {
                  console.log("passport facebook save user -> ", user)
                })
                .catch(err => console.log("passport facebook save err -> ", err))

              return done(null, newUser);
            };
          })
          .catch(err => console.log("Passport err ->  ", err));
      }
    ));
};

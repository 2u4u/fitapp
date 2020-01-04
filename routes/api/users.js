const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load user model
const User = require("../../models/User");

// @route   POST api/users/register
// @desk    Register users
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const email = req.body.email;
  User
    //check if such email exists in any strategy
    .findOne({ email })
    .then(user => {
      if (user) {
        //if such email exists in db
        if (user.local.email) {
          errors.email = "User with such email is already registered";
          return res.status(400).json(errors);
        } else {
          user.local.email = req.body.email;
          user.local.name = req.body.name;
          user.local.password = req.body.password

          //salt password to save in db
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.local.password, salt, (err, hash) => {
              if (err) console.log("bcrpyt err -> ", err);
              user.local.password = hash;
              user
                .save()
                .then(savedUser => res.json(savedUser))
                .catch(err => console.log("bcrypt save err -> ", err));
            });
          });
        }
      } else {
        //if user doesn't exist, then create new local user
        const newUser = new User({
          email: req.body.email,
          name: req.body.name,
          local: {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
          }
        });
        //salt password to save in db
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.local.password, salt, (err, hash) => {
            if (err) console.log("bcrpyt err -> ", err);
            newUser.local.password = hash;
            newUser
              .save()
              .then(savedUser => res.json(savedUser))
              .catch(err => console.log("bcrypt save err -> ", err));

          });
        });
      }
    });
});

// @route   POST api/users/login
// @desk    Login users
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      errors.email = "Пользователь не найден";
      return res.status(400).json(errors);
    }

    //Check password
    bcrypt.compare(password, user.local.password).then(isMatch => {
      if (isMatch) {
        //User Matched

        // Create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          privilege: user.privilege,
        };

        // Sing Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 36000000000000000000000 },//3600
          (err, token) => {
            if (err) console.log("jwt err -> ", err);
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Неверный пароль";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   POST api/users/logout
// @desk    Logout users
// @access  Public
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err)
    req.logout()
    res.sendStatus(200)
  })
});

// @route   POST api/users/auth/facebook
// @desk    Login users with facebook
// @access  Public
router.get("/auth/facebook/", (req, res, next) => {
  passport.authenticate('facebook', {
    scope: ['email'],
    callbackURL: "https://localhost:5000/api/users/auth/fb/callback/"
  })(req, res, next)
});

// @route   POST api/users/auth/facebook/callback
// @desk    Login users with facebook callback
// @access  Public
router.get('/auth/fb/callback/', (req, res, next) => {
  passport.authenticate('facebook', {
    scope: ['email'],
    successRedirect: 'https://localhost:3000/',
    failureRedirect: 'https://localhost:3000/login',
    callbackURL: "https://localhost:5000/api/users/auth/fb/callback/"
  })(req, res, next);
});

// @route   POST api/users/auth/google
// @desk    Login users with google
// @access  Public
router.get("/auth/google/:id", (req, res, next) => {
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    callbackURL: "https://localhost:5000/api/users/auth/google/callback/" + req.params.id
  })(req, res, next);
});

// @route   POST api/users/auth/google/callback
// @desk    Login users with google callback
// @access  Public
router.get('/auth/google/callback/:id', (req, res, next) => {
  let url = (req.params.id === "main") ? "" : req.params.id
  passport.authenticate('google', {
    successRedirect: 'https://localhost:3000/' + url,
    failureRedirect: 'https://localhost:3000/login',
    callbackURL: "https://localhost:5000/api/users/auth/google/callback/" + req.params.id
  })(req, res, next);
});

// @route   GET api/users/social
// @desk    Check if user currently loged in with facebook/google
// @access  Public
router.get('/social', (req, res) => {
  if (req.user) {

    // Create JWT payload
    const payload = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      privilege: req.user.privilege,
      avatar: ""
    };

    // Sign Token
    jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) console.log("jwt err -> ", err);
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }
    );
  }
});

// @route   GET api/users/current
// @desk    Return current user
// @access  Private
router.get("/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      privilege: req.user.privilege
    });
  }
);

// @route   GET api/users/all
// @desk    Return all users
// @access  Public (for now)
// TODO it Admin
router.get("/all",
  (req, res) => {
    User.find((err, users) => {
      if (err) return res.send(err);
      res.json(users);
    });
  }
);

module.exports = router;

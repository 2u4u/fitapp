const express = require("express");
const router = express.Router();
const transliterate = require("../../utils/transliterate");
const createHandleId = require("../../utils/createHandleId");
const passport = require("passport");

// Load input validation
const validateAddMaraphon = require("../../validation/maraphon");

// Load post model
const Maraphon = require("../../models/Maraphon");

// @route   POST api/maraphons/add
// @desk    Add post
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddMaraphon(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { name, id, user, description, duration, category, tags, goals, start_date, start_time, price, free } = req.body;
    let handle = transliterate(name);
    //check if handle is less then 20 symbols, then just add hash, if more - trim it to 20 and add hash
    //hash is based on handle
    handle = (handle.length > 20) ? handle.slice(0, 20) + "_" + createHandleId(handle) : handle + "_" + createHandleId(handle);

    Maraphon
      //check if such maraphon for this user exists
      .findOne({ handle, user })
      .then(maraphon => {
        if (maraphon) {
          if (maraphon._id == id) {
            //if this maraphon with this id exists then update it with new data
            //first change handle based on new topic 
            let newHandle = transliterate(name);
            newHandle = (newHandle.length > 20) ? newHandle.slice(0, 20) + "_" + createHandleId(newHandle) : newHandle + "_" + createHandleId(newHandle);

            maraphon.user = user;
            maraphon.name = name;
            maraphon.description = description;
            maraphon.duration = duration;
            maraphon.category = category;
            maraphon.tags = tags;
            maraphon.goals = goal;
            maraphon.start_date = start_date;
            maraphon.price = price;
            maraphon.handle = newHandle;
            maraphon.start_time = start_time;
            maraphon.free = free;

            maraphon
              .save()
              .then(savedMaraphon => res.json(savedMaraphon))
              .catch(err => console.log("Maraphon edit err -> ", err));
          } else {
            //if another maraphon with this handle exists for this user with another id
            errors.topic = "У вас уже есть марафон с таким названием";
            return res.status(400).json(errors);
          }
        } else {
          //if user doesn't have maraphone with such name
          const newMaraphon = new Maraphon({ name, user, description, duration, category, tags, goals, start_date, start_time, price, free, handle });

          newMaraphon
            .save()
            .then(savedMaraphon => res.json(savedMaraphon))
            .catch(err => console.log("Maraphon save err -> ", err));
        }
      });
  });

// @route   GET api/maraphons/all/:user
// @desk    Return all maraphons of exact user
// @access  Public
router.get("/all/:user", (req, res) => {
  Maraphon
    .find({ user: req.params.user })
    .then(maraphons => res.json(maraphons))
    .catch(err => console.log("Maraphons show for exact user all err -> ", err));
});

// @route   GET api/maraphons/all
// @desk    Return all maraphons of all users
// @access  Public
router.get("/all", (req, res) => {
  Maraphon
    .find()
    .then(maraphons => res.json(maraphons))
    .catch(err => console.log("Maraphons show all err -> ", err));
});

// @route   GET api/maraphons/detailed/:handle
// @desk    Return maraphon details for :handle
// @access  Public
router.get("/detailed/:handle", (req, res) => {
  Maraphon
    .findOne({ handle: req.params.handle })
    .then(maraphon => res.json(maraphon))
    .catch(err => console.log("Maraphon detailed err -> ", err));
});

// @route   POST api/posts/like/:id
// @desk    Like post
// @access  Private
router.post("/like/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    Post
      .findById(postId)
      .then(post => {
        //check if post was already liked
        if (post.likes.filter(like => like.user.toString() === userId).length > 0) {
          //if if has been already liked
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(userId);
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        } else if (post.likes.filter(like => like.user.toString() === userId).length === 0) {
          //if if hasn't been already liked
          post.likes.unshift({ user: userId });
          post.save().then(post => res.json(post))
        }
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  });

// @route   DELETE api/posts/delete/:postId
// @desk    Delete post
// @access  Private
router.delete(
  "/delete/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Post.findOneAndRemove({ _id: req.params.postId })
      .then(() => res.json({ success: true }))
      .catch(err => {
        errors.post = "There is no post with this handle";
        res.status(400).json(errors);
      });
  }
);

// @route   GET api/posts/edit/:id
// @desk    Return post to edit
// @access  Private
router.get("/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post
      .findOne({ _id: req.params.id })
      .then(post => res.json(post))
      .catch(err => console.log("Post show to edit err -> ", err));
  });

// @route   GET api/posts/detailed/:user/:handle
// @desk    Return post details for :user and :handle
// @access  Public
router.get("/detailed/:user/:handle", (req, res) => {
  Post
    .findOne({ name: req.params.user, handle: req.params.handle })
    .then(post => res.json(post))
    .catch(err => console.log("Post show detailed err -> ", err));
});

module.exports = router;

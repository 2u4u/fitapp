const express = require("express");
const router = express.Router();
const transliterate = require("../../utils/transliterate");
const createHandleId = require("../../utils/createHandleId");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateAddPost = require("../../validation/post");

// Load post model
const Post = require("../../models/Post");

// @route   POST api/posts/add
// @desk    Add post
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddPost(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { name, topic, user, subtopic, text, tags, category, id } = req.body;
    let handle = transliterate(topic);
    //check if handle is less then 30 symbols, then just add hash, if more - trim it to 30 and add hash
    //hash is based on handle
    handle = (handle.length > 30) ? handle.slice(0, 30) + "_" + createHandleId(handle) : handle + "_" + createHandleId(handle);

    Post
      //check if such post for this user exists
      .findOne({ handle, user })
      .then(post => {
        if (post) {
          if (post._id == id) {
            //if this post with this id exists then update it with new data
            //first change handle based on new topic 
            let newHandle = transliterate(topic);
            newHandle = (newHandle.length > 30) ? newHandle.slice(0, 30) + "_" + createHandleId(newHandle) : newHandle + "_" + createHandleId(newHandle);

            post.topic = topic;
            post.user = user;
            post.subtopic = subtopic;
            post.text = text;
            post.tags = tags;
            post.category = category;
            post.handle = newHandle;

            post
              .save()
              .then(savedPost => res.json(savedPost))
              .catch(err => console.log("Post edit err -> ", err));
          } else {
            //if another post with this handle exists for this user with another id
            errors.topic = "You already have post with such topic";
            return res.status(400).json(errors);
          }
        } else {
          //if user doesn't have post with such topic
          const newPost = new Post({ name, topic, user, subtopic, text, tags, category, handle });

          newPost
            .save()
            .then(savedPost => res.json(savedPost))
            .catch(err => console.log("Post save err -> ", err));
        }
      });
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

// @route   GET api/posts/all/:user
// @desk    Return all post of exact user
// @access  Public
router.get("/all/:user", (req, res) => {
  Post
    .find({ user: req.params.user })
    .then(posts => res.json(posts))
    .catch(err => console.log("Post show for exact user all err -> ", err));
});

// @route   GET api/posts/all
// @desk    Return all posts of all users
// @access  Public
router.get("/all", (req, res) => {
  Post
    .find()
    .then(posts => res.json(posts))
    .catch(err => console.log("Post show all err -> ", err));
});

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

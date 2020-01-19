const express = require("express");
const router = express.Router();
const transliterate = require("../../utils/transliterate");
const createHandleId = require("../../utils/createHandleId");
const passport = require("passport");

// Load input validation
const validateAddMarathon = require("../../validation/marathon");

// Load post model
const Marathon = require("../../models/Marathon");

// @route   POST api/marathons/add
// @desk    Add marathon
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddMarathon(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { name, id, user, description, duration, category, goals, start_date, start_time, price, free } = req.body;
    let handle = transliterate(name);
    //check if handle is less then 20 symbols, then just add hash, if more - trim it to 20 and add hash
    //hash is based on handle
    handle = (handle.length > 20) ? handle.slice(0, 20) + "_" + createHandleId(handle) : handle + "_" + createHandleId(handle);

    // let goalObj = goals.map(itemString => {
    //   let itemObj = {};
    //   itemObj.goal = itemString
    //   return itemObj
    // })

    Marathon
      //check if such marathon for this user exists
      .findOne({ handle, user })
      .then(marathon => {
        if (marathon) {
          if (marathon._id == id) {
            //if this marathon with this id exists then update it with new data
            //first change handle based on new topic 
            let newHandle = transliterate(name);
            newHandle = (newHandle.length > 20) ? newHandle.slice(0, 20) + "_" + createHandleId(newHandle) : newHandle + "_" + createHandleId(newHandle);

            marathon.user = user;
            marathon.name = name;
            marathon.description = description;
            marathon.duration = duration;
            marathon.category = category;
            // marathon.goals = goalObj;
            marathon.goals = goals;
            marathon.start_date = start_date;
            marathon.price = price;
            marathon.handle = newHandle;
            marathon.start_time = start_time;
            marathon.free = free;

            // marathon = { name, user, description, duration, category, goals: goalObj, start_date, start_time, price, free, handle: newHandle }

            marathon
              .save()
              .then(savedMarathon => res.json(savedMarathon))
              .catch(err => console.log("Ошибка сохранения изменений марафона -> ", err));
          } else {
            //if another marathon with this handle exists for this user with another id
            errors.topic = "У вас уже есть марафон с таким названием. Чтобы изменить существующий марафон войдите в него и выберите Редактирование";
            return res.status(400).json(errors);
          }
        } else {
          //if user doesn't have marathon with such name
          const newMarathon = new Marathon({ name, user, description, duration, category, goals, start_date, start_time, price, free, handle });

          newMarathon
            .save()
            .then(savedMarathon => res.json(savedMarathon))
            .catch(err => console.log("Ошибка сохранения марафона -> ", err));
        }
      });
  });

// @route   POST api/marathons/changestatus/:handle
// @desk    Activate marathon
// @access  Private
router.post("/changestatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { handle, status } = req.body;
    Marathon
      .findOne({ handle })
      .then(marathon => {
        marathon.status = status;

        marathon
          .save()
          .then(savedMarathon => res.json(savedMarathon))
          .catch(err => console.log("Ошибка изменения статуса марафона -> ", err));
      });
  });

// @route   GET api/marathons/all/:user
// @desk    Return all marathons of exact user
// @access  Public
router.get("/all/:user", (req, res) => {
  Marathon
    .find({ user: req.params.user })
    .then(marathons => res.json(marathons))
    .catch(err => console.log("Ошибка отображения всех марафонов пользователя -> ", err));
});

// @route   GET api/marathons/all
// @desk    Return all marathons of all users
// @access  Public
router.get("/all", (req, res) => {
  Marathon
    .find()
    .then(marathons => res.json(marathons))
    .catch(err => console.log("Ошибка отображения всех марафонов -> ", err));
});

// @route   GET api/marathons/detailed/:handle
// @desk    Return marathon details for :handle
// @access  Public
router.get("/detailed/:handle", (req, res) => {
  Marathon
    .findOne({ handle: req.params.handle })
    .then(marathon => res.json(marathon))
    .catch(err => console.log("Ошибка отображения информации о марафоне -> ", err));
});


//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//

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

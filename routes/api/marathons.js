const express = require("express");
const router = express.Router();
const transliterate = require("../../utils/transliterate");
const createHandleId = require("../../utils/createHandleId");
const passport = require("passport");

// Load validation(s)
const validateAddMarathon = require("../../validation/marathonValidation");

// Load model(s)
const Marathon = require("../../models/Marathon");

// @route   POST api/marathons/add
// @desk    Add marathon
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddMarathon(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { name, id, user, description, duration, category, goals } = req.body;
    let handle = transliterate(name);
    //check if handle is less then 10 symbols, then just add hash (based on handle), if more - trim it and add hash
    handle = (handle.length > 10) ? handle.slice(0, 10) + "_" + createHandleId(handle) : handle + "_" + createHandleId(handle);

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
            marathon.goals = goals;
            marathon.handle = newHandle;

            marathon
              .save()
              .then(savedMarathon => res.json(savedMarathon))
              .catch(err => {
                errors.main = "Ошибка сохранения изменений марафона. Свяжитесь с технической поддержкой";
                console.log("Ошибка сохранения изменений марафона. Текст ошибки: ", err)
                return res.status(400).json(errors);
              });
          } else {
            //if another marathon with this handle exists for this user with another id
            errors.topic = "У вас уже есть марафон с таким названием. Чтобы изменить существующий марафон войдите в него и выберите Редактирование";
            return res.status(400).json(errors);
          }
        } else {
          //if user doesn't have marathon with such name
          const newMarathon = new Marathon({ name, user, description, duration, category, goals, handle });

          newMarathon
            .save()
            .then(savedMarathon => res.json(savedMarathon))
            .catch(err => {
              errors.main = "Ошибка сохранения марафона. Свяжитесь с технической поддержкой";
              console.log("Ошибка сохранения марафона. Текст ошибки: ", err)
              return res.status(400).json(errors);
            });
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
          .catch(err => {
            errors.main = "Ошибка изменения статуса марафона. Свяжитесь с технической поддержкой";
            console.log("Ошибка изменения статуса марафона. Текст ошибки: ", err)
            return res.status(400).json(errors);
          });
      });
  });

// @route   GET api/marathons/all/:user
// @desk    Return all marathons of exact user
// @access  Public
router.get("/all/:user", (req, res) => {
  Marathon
    .find({ user: req.params.user })
    .then(marathons => res.json(marathons))
    .catch(err => {
      errors.main = "Ошибка отображения всех марафонов пользователя. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения всех марафонов пользователя. Текст ошибки: ", err)
      return res.status(400).json(errors);
    });
});

// @route   GET api/marathons/all
// @desk    Return all marathons of all users
// @access  Public
router.get("/all", (req, res) => {
  Marathon
    .find()
    .then(marathons => res.json(marathons))
    .catch(err => {
      errors.main = "Ошибка отображения всех марафонов. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения всех марафонов. Текст ошибки: ", err)
      return res.status(400).json(errors);
    });
});

// @route   GET api/marathons/detailed/:handle
// @desk    Return marathon details for :handle
// @access  Public
router.get("/detailed/:handle", (req, res) => {
  Marathon
    .findOne({ handle: req.params.handle })
    .then(marathon => res.json(marathon))
    .catch(err => {
      errors.main = "Ошибка отображения информации о марафоне. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения информации о марафоне. Текст ошибки: ", err)
      return res.status(400).json(errors);
    });
});

// @route   DELETE api/marathons/delete/:marathonId
// @desk    Delete marathon
// @access  Private
router.delete(
  "/delete/:marathonId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    //добавить удаление потоков тоже и удаление информации о потоке из модели марафона
    Marathon.findOneAndRemove({ _id: req.params.marathonId })
      .then(() => res.json({ success: true }))
      .catch(err => {
        errors.main = "Нет такого марафона. Свяжитесь с технической поддержкой";
        console.log("Нет такого марафона. Текст ошибки: ", err)
        return res.status(400).json(errors);
      });
  }
);

module.exports = router;

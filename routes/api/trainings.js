const express = require("express");
const router = express.Router();
const transliterate = require("../../utils/transliterate");
const createHandleId = require("../../utils/createHandleId");
const passport = require("passport");

// Load input validation
const validateAddTraining = require("../../validation/training");

// Load post model
const Training = require("../../models/Training");
const Maraphon = require("../../models/Maraphon");

// @route   POST api/trainings/add
// @desk    Add post
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddTraining(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { user, maraphon, id, name, description, show_name } = req.body;
    let handle = transliterate(name);
    //check if handle is less then 20 symbols, then just add hash, if more - trim it to 20 and add hash
    //hash is based on handle
    handle = (handle.length > 20) ? handle.slice(0, 20) + "_" + createHandleId(handle) : handle + "_" + createHandleId(handle);

    Training
      //check if such training for this user exists
      .findOne({ handle, user })
      .then(training => {
        if (training) {
          if (training._id == id) {
            //if this training with this id exists then update it with new data
            //first change handle based on new topic 
            let newHandle = transliterate(name);
            newHandle = (newHandle.length > 20) ? newHandle.slice(0, 20) + "_" + createHandleId(newHandle) : newHandle + "_" + createHandleId(newHandle);

            training.user = user;
            training.name = name;
            training.description = description;
            training.show_name = show_name;

            training
              .save()
              .then(savedTraining => res.json(savedTraining))
              .catch(err => console.log("Training edit err -> ", err));
          } else {
            //if another Training with this handle exists for this user with another id
            errors.topic = "У вас уже есть тренировка с таким названием";
            return res.status(400).json(errors);
          }
        } else {
          //if user doesn't have Training with such name
          const newTraining = new Training({ maraphon, user, name, description, show_name, handle });

          newTraining
            .save()
            .then(savedTraining => {
              Maraphon
                .findById(maraphon)
                .then(maraphon => {
                  maraphon.trainings.push({ "training_id": savedTraining._id })
                  maraphon
                    .save()
                    .then(savedMaraphon => res.json(savedTraining))
                    .catch(err => console.log("Maraphon save training err -> ", err));
                })
            })
            .catch(err => console.log("Training save err -> ", err));

        }
      });
  });

// @route   GET api/trainings/all/:maraphon
// @desk    Return all trainings in exact maraphon
// @access  Public
router.get("/all/:maraphon", (req, res) => {
  Training
    .find({ maraphon: req.params.maraphon })
    .then(trainings => res.json(trainings))
    .catch(err => console.log("Trainings show for exact maraphon all err -> ", err));
});

// @route   GET api/trainings/detailed/:handle
// @desk    Return training details for :handle
// @access  Public
router.get("/detailed/:handle", (req, res) => {
  Training
    .findOne({ handle: req.params.handle })
    .then(training => res.json(training))
    .catch(err => console.log("training detailed err -> ", err));
});

module.exports = router;

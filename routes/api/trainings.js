const express = require("express");
const router = express.Router();
const transliterate = require("../../utils/transliterate");
const createHandleId = require("../../utils/createHandleId");
const passport = require("passport");

// Load input validation
const validateAddTraining = require("../../validation/trainingValidation");

// Load post model
const Training = require("../../models/Training");
const Marathon = require("../../models/Marathon");

// @route   POST api/trainings/add
// @desk    Add post
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddTraining(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { id, user, marathon, flow, name, description, show_name, tasks } = req.body;
    let handle = transliterate(name);
    //check if handle is less then 10 symbols, then just add hash, if more - trim it to 10 and add hash
    handle = (handle.length > 10) ? handle.slice(0, 10) + "_" + createHandleId(handle) : handle + "_" + createHandleId(handle);

    Training
      //check if such training for this user exists
      .findOne({ handle, marathon, flow })
      .then(training => {
        if (training) {
          //if training with same handle exists, than check id
          if (training._id == id) {
            //if this training with this id exists then update it with new data
            //first change handle based on new topic 
            let newHandle = transliterate(name);
            newHandle = (newHandle.length > 10) ? newHandle.slice(0, 10) + "_" + createHandleId(newHandle) : newHandle + "_" + createHandleId(newHandle);

            // training.name = name;
            training.description = description;
            training.show_name = show_name;
            training.tasks = tasks

            training
              .save()
              .then(savedTraining => res.json(savedTraining))
              .catch(err => {
                errors.main = "Ошибка редактирования тренировки. Свяжитесь с технической поддержкой";
                console.log("Ошибка редактирования тренировки. Текст ошибки: ", err)
                return res.status(400).json(errors);
              });
          } else {
            //if another Training with this handle exists for this user with another id
            errors.topic = "У вас уже есть тренировка с таким названием в этом потоке";
            return res.status(400).json(errors);
          }
        } else {
          //if user doesn't have Training with such name
          const newTraining = new Training({ marathon, flow, user, name, description, show_name, handle, tasks });

          newTraining
            .save()
            .then(savedTraining => {
              Marathon
                .findById(marathon)
                .then(marathon => {
                  marathon.trainings.push({ "training_id": savedTraining._id })
                  marathon
                    .save()
                    .catch(err => {
                      errors.main = "Ошибка сохранения тренировки в марафоне. Свяжитесь с технической поддержкой";
                      console.log("Ошибка сохранения тренировки в марафоне. Текст ошибки:", err)
                      return res.status(400).json(errors);
                    });
                });

              Flow
                .findById(flow)
                .then(flow => {
                  flow.trainings.push({ "training_id": savedTraining._id })
                  flow
                    .save()
                    .then(() => res.json(savedTraining))
                    .catch(err => {
                      errors.main = "Ошибка сохранения тренировки в потоке. Свяжитесь с технической поддержкой";
                      console.log("Ошибка сохранения тренировки в потоке. Текст ошибки:", err)
                      return res.status(400).json(errors);
                    });
                })
                .catch(err => {
                  errors.main = "Не найден поток для этой тренировки. Свяжитесь с технической поддержкой";
                  console.log("Не найден поток для этой тренировки. Текст ошибки:", err)
                  return res.status(400).json(errors);
                });
            })
            .catch(err => {
              errors.main = "Ошибка сохранения тренировки. Свяжитесь с технической поддержкой";
              console.log("Ошибка сохранения тренировки. Текст ошибки:", err)
              return res.status(400).json(errors);
            });
        }
      });
  });

// @route   GET api/trainings/all/:marathon/:flow
// @desk    Return all trainings in exact marathon and flow
// @access  Public
router.get("/all/:marathon/:flow", (req, res) => {
  Training
    .find({ marathon: req.params.marathon, flow: req.params.flow })
    .then(trainings => res.json(trainings))
    .catch(err => {
      errors.main = "Ошибка отображения тренировок потока. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения тренировок потока. Текст ошибки:", err)
      return res.status(400).json(errors);
    });
});

// @route   GET api/trainings/detailed/:handle
// @desk    Return training details for :handle
// @access  Public
router.get("/detailed/:handle", (req, res) => {
  Training
    .findOne({ handle: req.params.handle })
    .then(training => res.json(training))
    .catch(err => {
      errors.main = "Ошибка отображения детальной информации о тренировке. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения детальной информации о тренировке. Текст ошибки:", err)
      return res.status(400).json(errors);
    });
});

// @route   POST api/trainings/changestatus/:handle
// @desk    Activate training
// @access  Private
router.post("/changestatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { handle, status } = req.body;
    Training
      .findOne({ handle })
      .then(training => {
        training.status = status;

        training
          .save()
          .then(savedTraining => res.json(savedTraining))
          .catch(err => {
            errors.main = "Ошибка изменения статуса тренировки. Свяжитесь с технической поддержкой";
            console.log("Ошибка изменения статуса тренировки. Текст ошибки: ", err)
            return res.status(400).json(errors);
          });
      });
  });

module.exports = router;
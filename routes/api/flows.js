const express = require("express");
const router = express.Router();
const createHandleId = require("../../utils/createHandleId");
const passport = require("passport");

// Load input validation
const validateAddFlow = require("../../validation/flowValidation");

// Load models
const Flow = require("../../models/Flow");
const Marathon = require("../../models/Marathon");

// @route   POST api/flows/add
// @desk    Add flow
// @access  Private
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddFlow(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { id, user, marathon, name, duration, start_date, start_time, price, free } = req.body;
    //handle is hash based on name
    let handle = createHandleId(name);

    Flow
      //check if such flow for this marathon exists
      .findOne({ handle, marathon })
      .then(flow => {
        if (flow) {
          //if flow with same handle exists, than check id
          if (flow._id == id) {
            //if id is equal, than we are editing flow changable information
            flow.duration = duration;
            flow.start_date = start_date;
            flow.start_time = start_time;
            flow.price = price;
            flow.free = free;

            flow
              .save()
              .then(savedFlow => res.json(savedFlow))
              .catch(err => {
                errors.main = "Ошибка редактирования потока. Свяжитесь с технической поддержкой";
                console.log("Ошибка редактирования потока. Текст ошибки: ", err)
                return res.status(400).json(errors);
              });
          } else {
            //if another flow with this handle exists for this user with another id, than
            errors.name = "У вас уже есть поток с таким названием для этого марафона";
            return res.status(400).json(errors);
          }
        } else {
          //if flow doesn't exist
          const newFlow = new Flow({ user, handle, marathon, name, duration, start_date, start_time, price, free });

          newFlow
            .save()
            .then(savedFlow => {
              Marathon
                .findById(marathon)
                .then(marathon => {
                  // save flow id to marathon model
                  marathon.flows.push({ "flow_id": savedFlow._id })
                  marathon
                    .save()
                    .then(() => res.json(savedFlow))
                    .catch(err => {
                      errors.main = "Ошибка сохранения информации о марафоне при сохранении потока. Свяжитесь с технической поддержкой";
                      console.log("Ошибка сохранения информации о марафоне при сохранении потока. Текст ошибки:", err)
                      return res.status(400).json(errors);
                    });
                })
            })
            .catch(err => {
              errors.main = "Ошибка сохранения потока. Свяжитесь с технической поддержкой";
              console.log("Ошибка сохранения потока. Текст ошибки: ", err)
              return res.status(400).json(errors);
            });

        }
      });
  });

// @route   GET api/flows/all/:marathon
// @desk    Return all flows for exact marathon
// @access  Public
router.get("/all/:marathon", (req, res) => {
  Flow
    .find({ marathon: req.params.marathon })
    .then(flows => res.json(flows))
    .catch(err => {
      errors.main = "Ошибка отображения потоков марафона. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения потоков марафона. Текст ошибки: ", err)
      return res.status(400).json(errors);
    });
});

// @route   GET api/flows/detailed/:handle
// @desk    Return flow details for :handle
// @access  Public
router.get("/detailed/:handle", (req, res) => {
  Flow
    .findOne({ handle: req.params.handle })
    .then(flow => res.json(flow))
    .catch(err => {
      errors.main = "Ошибка отображения детальной информации о потоке. Свяжитесь с технической поддержкой";
      console.log("Ошибка отображения детальной информации о потоке. Текст ошибки: ", err)
      return res.status(400).json(errors);
    });
});

// @route   POST api/flows/changestatus/:handle
// @desk    Activate flow
// @access  Private
router.post("/changestatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { handle, status } = req.body;
    Flow
      .findOne({ handle })
      .then(flow => {
        flow.status = status;

        flow
          .save()
          .then(savedFlow => res.json(savedFlow))
          .catch(err => {
            errors.main = "Ошибка изменения статуса потока. Свяжитесь с технической поддержкой";
            console.log("Ошибка изменения статуса потока. Текст ошибки: ", err)
            return res.status(400).json(errors);
          });
      });
  });

// @route   DELETE api/flows/delete/:flowId
// @desk    Delete flow
// @access  Private
router.delete(
  "/delete/:flowId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    //добавить удаление тренировок тоже и удаление информации о потоке из модели марафона
    Flow.findOneAndRemove({ _id: req.params.flowId })
      .then(() => res.json({ success: true }))
      .catch(err => {
        errors.main = "Нет потоков с таким ID. Свяжитесь с технической поддержкой";
        console.log("Нет потоков с таким ID. Текст ошибки: ", err)
        return res.status(400).json(errors);
      });
  }
);

// @route   POST api/flows/addquestion
// @desk    Add question to flow
// @access  Private
router.post("/addquestion",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // const { errors, isValid } = validateAddFlow(req.body);
    // if (!isValid) return res.status(400).json(errors);

    const { id, flow_id, questionary } = req.body;

    Flow
      .findOne({ id: flow_id })
      .then(flow => {
        if (flow) {
          //if training with same handle exists, than check id
          // if (training._id == id) {
          //   flow.questionary = questionary;

          //   flow
          //     .save()
          //     .then(savedFlow => res.json(savedFlow))
          //     .catch(err => {
          //       errors.main = "Ошибка при добавлении анкеты в поток. Свяжитесь с технической поддержкой";
          //       console.log("Ошибка при добавлении анкеты в поток. Текст ошибки: ", err)
          //       return res.status(400).json(errors);
          //     });
          // } else {
          //   //if another flow with this handle exists for this user with another id, than
          //   errors.name = "У вас уже есть поток с таким названием для этого марафона";
          //   return res.status(400).json(errors);
          // }
        } else {
          //if flow doesn't exist
          errors.main = "Ошибка сохранения информации о марафоне при сохранении потока. Свяжитесь с технической поддержкой";
          console.log("Ошибка сохранения информации о марафоне при сохранении потока. Текст ошибки:", err)
          return res.status(400).json(errors);


        }
      });
  });


module.exports = router;

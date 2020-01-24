const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateAddTraining(data) {
  let errors = {};

  data.name = _.isEmpty(data.name) ? "" : data.name;

  if (Validator.isEmpty(data.name)) {
    errors.trainingName = "Не заполнено название тренировки";
  }

  if (!data.description_has_text) {
    errors.trainingDescription = "Не заполнено описание тренировки";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

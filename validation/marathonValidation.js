const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateAddMarathon(data) {
  let errors = {};

  data.name = _.isEmpty(data.name) ? "" : data.name;
  data.description = _.isEmpty(data.description) ? "" : data.description;
  data.category = _.isEmpty(data.category) ? "" : data.category;
  data.goals = data.goals.length === 0 ? [] : data.goals;
  // data.duration = _.isEmpty(data.duration) ? "" : data.duration;
  // data.start_date = _.isEmpty(data.start_date) ? "" : data.start_date;
  // data.price = _.isEmpty(data.price) ? "" : data.price;

  if (Validator.isEmpty(data.name)) {
    errors.marathonName = "Не заполнено название марафона";
  }

  if (Validator.isEmpty(data.description)) {
    errors.marathonDescription = "Не заполнено описание марафона";
  }

  if (Validator.isEmpty(data.category)) {
    errors.marathonCategory = "Не заполнена категория марафона";
  }

  if (data.goals.length === 0) {
    errors.marathonGoal = "Не заполнены цели марафона";
  }

  // if (Validator.isEmpty(data.duration)) {
  //   errors.marathonDuration = "Не заполнена длительность марафона";
  // }

  // if (Validator.isEmpty(data.start_date)) {
  //   errors.marathonStartDate = "Не дата начала марафона";
  // }

  // if (Validator.isEmpty(data.price)) {
  //   if (!data.free) {
  //     errors.marathonPrice = "Не заполнена стоимость марафона";
  //   }
  // }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

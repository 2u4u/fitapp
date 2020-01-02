const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateAddMaraphon(data) {
  let errors = {};

  data.name = _.isEmpty(data.name) ? "" : data.name;
  data.description = _.isEmpty(data.description) ? "" : data.description;
  data.duration = _.isEmpty(data.duration) ? "" : data.duration;
  data.category = _.isEmpty(data.category) ? "" : data.category;
  // data.goals = _.isEmpty(data.goals) ? "" : data.goals;
  data.start_date = _.isEmpty(data.start_date) ? "" : data.start_date;
  data.price = _.isEmpty(data.price) ? "" : data.price;


  if (Validator.isEmpty(data.name)) {
    errors.name = "Не заполнено название марафона";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Не заполнено описание марафона";
  }

  if (Validator.isEmpty(data.duration)) {
    errors.duration = "Не заполнена длительность марафона";
  }

  if (Validator.isEmpty(data.category)) {
    errors.category = "Не заполнена категория марафона";
  }

  // if (Validator.isEmpty(data.goals)) {
  //   errors.goals = "Не заполнены цели марафона";
  // }

  if (Validator.isEmpty(data.start_date)) {
    errors.start_date = "Не дата начала марафона";
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "Не заполнена стоимость марафона";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

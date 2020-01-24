const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateAddFlow(data) {
  let errors = {};

  data.name = _.isEmpty(data.name) ? "" : data.name;
  data.duration = _.isEmpty(data.duration) ? "" : data.duration;
  data.start_date = _.isEmpty(data.start_date) ? "" : data.start_date;
  data.price = _.isEmpty(data.price) ? "" : data.price;

  if (Validator.isEmpty(data.name)) {
    errors.flowName = "Не заполнено название потока";
  }

  if (Validator.isEmpty(data.duration)) {
    errors.flowDuration = "Не заполнена длительность потока";
  }

  if (Validator.isEmpty(data.start_date)) {
    errors.flowStartDate = "Не заполнена дата начала потока";
  }

  if (Validator.isEmpty(data.price)) {
    if (!data.free) {
      errors.flowPrice = "Не заполнена стоимость потока";
    }
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

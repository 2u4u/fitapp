const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = _.isEmpty(data.email) ? "" : data.email;
  data.password = _.isEmpty(data.password) ? "" : data.password;

  if (Validator.isEmpty(data.email)) {
    errors.email = "Поле email обязательно для заполнения";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Неверный формат поля email";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Поле пароль обязательно для заполнения";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

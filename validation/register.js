const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = _.isEmpty(data.name) ? "" : data.name;
  data.email = _.isEmpty(data.email) ? "" : data.email;
  data.password = _.isEmpty(data.password) ? "" : data.password;
  data.password2 = _.isEmpty(data.password2) ? "" : data.password2;

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Имя должно быть от 2 до 30 знаков";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Поле Имя обязательно для заполнения";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Поле email обязательно для заполнения";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Неверный формат поля email";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Поле пароль обязательно для заполнения";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Пароль должен быть от 6 до 30 знаков";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Поле подтвердить пароль обязательно для заполнения";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Пароли должны совпадать";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

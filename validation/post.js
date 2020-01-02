const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateAddPost(data) {
  let errors = {};

  data.topic = _.isEmpty(data.topic) ? "" : data.topic;
  data.subtopic = _.isEmpty(data.subtopic) ? "" : data.subtopic;
  data.text = _.isEmpty(data.text) ? "" : data.text;
  // data.tags = _.isEmpty(data.tags) ? "" : data.tags;
  // data.category = _.isEmpty(data.category) ? "" : data.category;


  if (Validator.isEmpty(data.topic)) {
    errors.topic = "Field topic is required";
  }

  if (Validator.isEmpty(data.subtopic)) {
    errors.subtopic = "Field subtopic is required";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Field text is required";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

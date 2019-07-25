const Validator = require("validator");
const isEmpty = require("./is-empty.js");

module.exports = function validateRegisterInput(data) {
  //INITIALIZE ERRORS
  let errors = {};

  //INITIALIZE THE STRINGS TO BE EMPTY FIRST
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  //CHECK IF THE FIELDS IS FILLED OUT
  if (Validator.isEmpty(data.username)) {
    errors.username = "Name field is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password must match";
  }

  //CHECK IF THE PASSWORD IS ATLEAST 6 CHARACTERS
  if (!Validator.isLength(data.password, { min: 3, max: 50 })) {
    errors.password = "Password must be atleast 3 characters";
  }
  //CHECK IF THE PASSWORD AND PASSWORD2 IS MATCHED
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

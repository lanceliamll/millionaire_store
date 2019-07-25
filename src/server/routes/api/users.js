const express = require("express");
const router = express.Router();
const config = require("config");
const authorized = require("../../middleware/authorized");
const User = require("../../models/User");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@ROUTE          localhost:5000/api/users/register
//@DESCRIPTION    create user
//@ACCESS         private
router.post("/register", async (req, res) => {
  //Error Validation
  const { isValid, errors } = validateRegisterInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    let userCollection = await User.find();

    if (user) {
      errors.user = "User already exists";
      return res.status(400).json(errors);
    } else {
      //Hash the password
      const hashedPassword = await bcypt.hash(password, 12);

      if (userCollection.length === 0) {
        user = await new User({
          username,
          password: hashedPassword,
          isAdmin: true
        });
      } else {
        user = await new User({
          username,
          password: hashedPassword
        });
      }
    }
    //Save
    await user.save();

    //Payload to manipulate data,
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };

    //Sign JWT to return token
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1hr" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//@ROUTE          localhost:5000/api/users/login
//@DESCRIPTION    loginuser
//@ACCESS         public

router.post("/login", async (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      errors.user = "Invalid Credentials";
      return res.status(400).json(errors);
    }

    const isMatch = await bcypt.compare(password, user.password);

    if (!isMatch) {
      errors.user = "Invalid Credentials";
      return res.status(400).json(errors);
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };

    //Sign Paylaod
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1hr" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

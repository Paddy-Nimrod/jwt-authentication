const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const User = require("../models/user")(sequelize, DataTypes);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.getHomePage = (req, res) => {
  res.status(200).send({ message: "This is the home page" });
};

exports.getPremiumContent = (req, res) => {
  res.status(200).send({ message: "This is paid content" });
};

exports.registerUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    return res.status(204).send({ message: "password to not match" });
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      await bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "internal server error", err });
        }
        User.create({ email: email, password: hash });
      });
      res.status(200).send({ message: "Registration ok" });
    });
  } catch (error) {
    res.status(500).send({ message: "internal server error", error });
  }
};

exports.loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res
              .status(200)
              .send({ message: "password is incorrect", error });
          }
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            "Random-Token",
            { expiresIn: "24h" }
          );
          res
            .status(200)
            .send({ message: "login success", email: user.email, token });
        })
        .catch((error) => {
          res.status(500).send({ message: "incorrect password", error });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: "No user with that email", error });
    });
};

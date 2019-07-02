//Includes Dependencies
var env = require("../config/env");
const Sequelize = require("sequelize");
//Includes Specific Libraries
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var express = require("express");

//Initializes App and Router
const router = express.Router();

//Includes Model
var { User, Op } = require("../models/User");

/**
 * User Registartion
 */
router.post("/register", function(req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  //Check user exist or not
  User.count({ where: { username: req.body.username, is_deleted: 0 } }).then(
    user => {
      if (user)
        return res
          .status(200)
          .send({ status: 0, message: "Username already exist." });
      else {
        return User.create({
          role: req.body.role,
          username: req.body.username,
          password: hashedPassword,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          created_by: req.body.created_by,
          created_at: req.body.created_at,
          updated_at: req.body.updated_at,
          updated_by: req.body.updated_by
        })
          .then(user => {
            //SUCCESS
            const token = jwt.sign({ id: user.id, role: user.role }, env.salt, {
              expiresIn: 86400 // expires in 24 hours
            });

            user
              .update({ token: token })
              .then(() => console.log("updated"))
              .catch(() => console.log("unable to update"));

            res.status(200).send({
              status: 1,
              message: "User has been created successfully"
            });
          })
          .catch(error => res.status(400).send(error)); //ERROR
      }
    }
  );
});

/**
 * Validate Token
 */
router.get("/validate", function(req, res) {
  const token = req.headers["token"];
  if (!token)
    return res.status(400).send({ auth: false, message: "No token provided." });

  jwt.verify(token, env.salt, function(err, decoded) {
    if (err)
      return res
        .status(400)
        .send({ auth: false, message: "Failed to authenticate token." });
    res.status(200).send(decoded);
  });
});

/**
 * Login Request
 */
router.post("/login", function(req, res) {
  console.log(req);
  User.findOne({ where: { username: req.body.username, is_deleted: 0 } })
    .then(user => {
      if (!user)
        return res.status(200).send({ status: 0, message: "No user found" });
      if (user.is_active == "0")
        return res
          .status(200)
          .send({ status: 0, message: "Your account is not active" });
      const passwordIsValid = bcrypt.compare(req.body.password, user.password);

      if (!passwordIsValid)
        return res.status(200).send({
          status: 0,
          auth: false,
          message: "Invalid username or password"
        });

      var token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname
        },
        env.salt,
        {
          expiresIn: 86400 // expires in 24 hours
        }
      );

      user
        .update({ token: token })
        .then(() => console.log("updated"))
        .catch(() => console.log("unable to update"));

      res
        .status(200)
        .send({
          status: 1,
          token: token,
          user: { firstname: user.firstname, lastname: user.lastname }
        });
    })
    .catch(error =>
      res
        .status(400)
        .send(error, { status: 0, message: "Invalid Username or Password" })
    );
});

/**
 * Update Status
 */
router.get("/toggle/:id/:status", function(req, res) {
  var x = req.params.status == true ? 0 : 1;
  console.log(x);
  User.update(
    {
      is_active: x
    },
    { where: { id: req.params.id } }
  )
    .then(() =>
      res.status(200).send({ message: "Status Updated successfully!" })
    )
    .catch(error => res.status(400).send(error));
});

/**
 * check for secure route
 */
router.get("/secureroute", function(req, res) {
  res.status(200).send({ message: "you are eligible for this route" });
});

module.exports = router;

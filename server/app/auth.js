//Includes Specific Libraries
var jwt = require("jsonwebtoken");

//Includes Dependencies
var env = require("./config/env");

/**
 * Handles the Authentication and Authorization
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Callback} next
 */
function handle(req, res, next) {
  //Gets the token from Header
  const token = get_token(req, res);

  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  let user;
  //Verify if it's the right Token
  jwt.verify(token, env.salt, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    user = decoded;
  });

  if (!user) return;

  //Checks permission on role
  verify_permissions(user, req, res, next);
}

/**
 * Gets token from request headers
 *
 * @param {Object} req
 * @param {Object} res
 */
function get_token(req, res) {
  const token = req.headers["token"];
  return token;
}

/**
 * Verifies the permission for user on current request
 *
 * @param {object} user
 * @param {object} req
 * @param {object} res
 * @param {callback} next
 */
function verify_permissions(user, req, res, next) {
  if (user.role == 1) {
    next();
  } else if (user.role == 2) {
    next();
  } else {
    return res.status(500).send({ auth: false, message: "Not authorized." });
  }
}

module.exports = handle;

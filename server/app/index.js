//Includes Dependencies
var env = require("./config/env");
var auth = require("./auth");

//Includes Specific Libraries
var express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const schema = require("./db");

//Initializes App and Router
var app = express();
const router = express.Router();
const urlEncoder = bodyParser.urlencoded({ extended: true });
const bodyParserJSON = bodyParser.json();
var corsOptions = {
  origin: env.request_origin,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//Adds Controller Files
var UserController = require("./controllers/UserController");
var GraphicController = require("./controllers/GraphicController");

app.use(cors(corsOptions));

//Middleware for post requests.
app.post(urlEncoder, bodyParserJSON, (req, res, next) => next());
app.put(urlEncoder, bodyParserJSON, (req, res, next) => next());
/**
 * Middleware for all requests.
 */
app.use(function(req, res, next) {
  //Public URLs
  if (req.url == "/users/login" || req.url == "/users/register") {
    next();
  }
  //Authenticated Area
  else {
    auth(req, res, next);
  }
});

//Defines Routes
app.use("/users", UserController);
app.use("/graphics", GraphicController);

//Listens
var server = app.listen(env.port, function() {
  console.log("Express server listening on port " + env.port);
});

module.exports = app;

const env = {
  name: "development", // "production", "staging"
  port: process.env.PORT || 5100,
  salt: "techformationsecuresalt",
  request_origin: "http://localhost:3000"
};

module.exports = env;

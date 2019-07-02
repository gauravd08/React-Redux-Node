const env = require("./env");

const db_config = {
  development: {
    username: "newuser",
    password: "password",
    database: "react-node-test",
    host: "localhost",
    port: 3306,
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: "password",
    database: "task_monitor_angular",
    host: "localhost",
    port: 8889,
    dialect: "mysql"
  }
};

module.exports = db_config[env.name];

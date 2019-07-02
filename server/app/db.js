//Includes Specific Libraries
const Sequelize = require('sequelize');

//Includes Dependencies
const db_config = require('./config/database');

//Creates Schema Object
const schema = new Sequelize(db_config.database, db_config.username, db_config.password, {
  host: db_config.host,
  dialect: db_config.dialect,
  port: db_config.port,
  timezone: '+5:30',
  operatorsAliases: false,
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

//Verifies Schema Connection
schema
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = schema;
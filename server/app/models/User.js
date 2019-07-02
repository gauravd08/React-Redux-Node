const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const schema = require("../db");

const User = schema.define("users", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: Sequelize.INTEGER, allowNull: false },
  username: { type: Sequelize.STRING, allowNull: false, isEmail: true },
  password: { type: Sequelize.STRING, allowNull: false },
  firstname: { type: Sequelize.STRING, allowNull: false },
  lastname: { type: Sequelize.STRING, allowNull: false },
  token: { type: Sequelize.STRING },
  is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
  is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
  created_at: { type: Sequelize.DATE },
  created_by: Sequelize.INTEGER,
  updated_at: { type: Sequelize.DATE },
  updated_by: Sequelize.INTEGER
});

module.exports = { User, Op };

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const schema = require("../db");

const Graphic = schema.define("graphics", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  image: { type: Sequelize.STRING, allowNull: false },
  caption: { type: Sequelize.STRING, allowNull: false },
  link: { type: Sequelize.STRING, allowNull: false },
  link_text: { type: Sequelize.STRING, allowNull: false },
  is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
  created_at: { type: Sequelize.DATE },
  updated_at: { type: Sequelize.DATE }
});

module.exports = { Graphic, Op };

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

module.exports = (sequelize) => {
  const Choice = sequelize.define('Choice', {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    probability: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return Choice;
};
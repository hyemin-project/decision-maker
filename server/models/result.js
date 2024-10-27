// models/Result.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Result = sequelize.define('Result', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    decisionQuestion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false
    },
    choices: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });

  Result.associate = function(models) {
    Result.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Result;
};
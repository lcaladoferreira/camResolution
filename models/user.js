const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
// associações podem ser definidas aqui  };

  User.prototype.generateAuthToken = function() {
    const token = jwt.sign(
      { id: this.id, username: this.username },
      process.env.jwtPrivateKey
    );
    return token;
  };

  return User;
};

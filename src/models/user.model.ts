import Sequelize from "sequelize";

const User = (sequelize: Sequelize.Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
  });

  User.sync({ alter: process.env.ENV == "development" }).catch(
    (error: Error) => {
      console.log("Something went wrong with User table", error);
    }
  );

  return User;
};

export default User;

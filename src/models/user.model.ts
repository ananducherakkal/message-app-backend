import Sequelize from "sequelize";

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface UserModel extends Sequelize.Model<UserAttributes>, UserAttributes {}

const User = (sequelize: Sequelize.Sequelize) => {
  const User = sequelize.define<UserModel>("user", {
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

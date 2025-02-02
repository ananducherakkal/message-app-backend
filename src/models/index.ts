import Sequelize from "sequelize";
import User from "./user.model";
import Message from "./message.model";

type Db = {
  User: ReturnType<typeof User>;
  Message: ReturnType<typeof Message>;
};
export const db: Db = {} as Db;

export const dbConnect = () => {
  const sequelize = new Sequelize.Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
      dialect: "mysql",
      logging: false,
      define: {
        freezeTableName: true,
      },
    }
  );

  db.User = User(sequelize);
  db.Message = Message(sequelize);

  // Log db connection status
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((error) => {
      console.log("Cannot connect to database!");
    });
};

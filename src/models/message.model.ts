import Sequelize from "sequelize";
import { MessageStatus } from "../types/message.type";
import { db } from ".";

interface MessageAttributes {
  id?: number;
  text: string;
  from: number;
  to: number;
  status: MessageStatus;
  send_time?: Date;
  delivered_time?: Date;
  seen_time?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface MessageModel
  extends Sequelize.Model<MessageAttributes>,
    MessageAttributes {}

const Message = (sequelize: Sequelize.Sequelize) => {
  const Message = sequelize.define<MessageModel>("message", {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    from: {
      type: Sequelize.INTEGER,
      references: {
        model: db.User,
        key: "id",
      },
    },
    to: {
      type: Sequelize.INTEGER,
      references: {
        model: db.User,
        key: "id",
      },
    },
    status: {
      type: Sequelize.ENUM("pending", "delivered", "seen"),
      allowNull: true,
      defaultValue: "pending",
    },
    send_time: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    delivered_time: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    seen_time: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  Message.sync({ alter: process.env.ENV == "development" }).catch(
    (error: Error) => {
      console.log("Something went wrong with Message table", error);
    }
  );

  return Message;
};

export default Message;

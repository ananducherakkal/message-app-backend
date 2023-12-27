import Sequelize from "sequelize";

export const throwDbError = (error: any) => {
  if (error instanceof Sequelize.ValidationError) {
    throw new Error("Db validation error");
  } else {
    throw new Error("Db error");
  }
};

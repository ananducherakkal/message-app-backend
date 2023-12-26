import { Express } from "express";
import todoRoutes from "./todo.route";
import catchAllError from "../controllers/catchAllError.controller";
import catchAllRoutes from "../controllers/catchAllRoutes.controller";

const allRoutes = (app: Express) => {
  app.use("/todo", todoRoutes);

  app.use(catchAllRoutes);
  app.use(catchAllError);
};

export default allRoutes;

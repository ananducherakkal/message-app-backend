import { Express } from "express";
import userRoutes from "./user.route";
import catchAllError from "../controllers/catchAllError.controller";
import catchAllRoutes from "../controllers/catchAllRoutes.controller";

const allRoutes = (app: Express) => {
  app.use("/user", userRoutes);

  app.use(catchAllRoutes);
  app.use(catchAllError);
};

export default allRoutes;

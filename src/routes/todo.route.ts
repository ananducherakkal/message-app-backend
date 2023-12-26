import { Router } from "express";
import * as todoController from "../controllers/todo.controller";

const router = Router({ mergeParams: true });

router.get("/", todoController.getTodo);

export default router;

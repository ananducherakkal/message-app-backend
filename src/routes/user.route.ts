import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router({ mergeParams: true });

router.get("/", userController.getUserList);

router.post("/", userController.createUser);

router.get("/:id", userController.getUserById);

export default router;

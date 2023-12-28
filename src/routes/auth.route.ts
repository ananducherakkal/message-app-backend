import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router({ mergeParams: true });

router.post("/login", authController.login);

export default router;

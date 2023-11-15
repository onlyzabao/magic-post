import { Router } from "express";
import authRouter from "./auth.router";
import departmentRouter from "./department.router";
import staffRouter from "./staff.router";
import controller from "../controllers/controller";

const router = Router();
controller(router, authRouter);
controller(router, departmentRouter);
controller(router, staffRouter);
export default router;
import { Router } from "express";
import authRouter from "./auth.router";
import departmentRouter from "./department.router";
import staffRouter from "./staff.router";
import shipmentRouter from "./shipment.router";
import transactionRouter from "./transaction.router";
import controller from "../controllers/controller";

const router = Router();
controller(router, authRouter);
controller(router, departmentRouter);
controller(router, staffRouter);
controller(router, shipmentRouter);
controller(router, transactionRouter);
export default router;
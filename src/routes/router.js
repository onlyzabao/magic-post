import { Router } from "express";
import apiv1 from "./apiv1";
import controller from "../controllers/controller";

const router = Router();
controller(router, apiv1);
export default router;
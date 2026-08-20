import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subscriptionRouter from "./subscriptions";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/subscription", subscriptionRouter);

export default router;

import { Application } from "express";
//! imp Routes
import { authRoutes } from "@auth/routes/authRoutes";
import { serverAdapter } from "@service/queues/base.queue";
import { currentUserRoutes } from "@auth/routes/currentUserRoutes";
import { authMiddleware } from "@global/helpers/auth-middleware";

const BASE_PATH = "/api/v1";

export default (app: Application) => {
  const routes = () => {
    //! connect with BullBoard
    app.use("/queues", serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  };

  routes();
};

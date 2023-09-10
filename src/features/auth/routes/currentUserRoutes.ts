import express, { Router } from "express";
import { currentUser } from "@auth/controllers/currentUser";
import { authMiddleware } from "@global/helpers/auth-middleware";

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get("/currentuser", authMiddleware.checkAuthentication, currentUser.read);

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();

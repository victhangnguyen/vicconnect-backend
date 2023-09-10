import { SignUp } from "@auth/controllers/signup";
import { signin } from "@auth/controllers/signin";

import express, { Router } from "express";
import { signout } from "@auth/controllers/signout";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post("/signup", SignUp.prototype.create);
    this.router.post("/signin", signin.read);

    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get("/signout", signout.update);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();

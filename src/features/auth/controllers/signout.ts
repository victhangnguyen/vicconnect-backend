import { Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { AuthController } from "./auth.controller";

class SignOut extends AuthController {
  constructor() {
    super("SignOut");
    this.update = this.update.bind(this);
  }

  public async update(req: Request, res: Response): Promise<void> {
    req.session = null;
    res.status(httpStatusCodes.OK).json({ message: "Logout successful", user: {}, token: "" });
  }
}

export const signout: SignOut = new SignOut();

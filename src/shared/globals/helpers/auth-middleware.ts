import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { config } from "@root/config";
import { UnAuthorizedError } from "@global/helpers/error-handler";
import { AuthPayload } from "@auth/interfaces/auth.interface";

export class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new UnAuthorizedError("Token is not available. Please login again.");
    }
    try {
      const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;

      req.currentUser = payload;

      next();
    } catch (error) {
      throw new UnAuthorizedError("Token is not available. Please login again.");
    }
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new UnAuthorizedError("Authentication is required to access this route.");
    }

    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();

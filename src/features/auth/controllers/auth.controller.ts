import { config } from "@root/config";
import Logger from "bunyan";
import JWT from "jsonwebtoken";
//! imp services-auth
import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { ObjectId } from "mongodb";

export abstract class AuthController {
  log: Logger;

  constructor(requestHandlerName: string) {
    this.log = config.createLogger(`authController-${requestHandlerName}`);
  }

  protected signToken(authData: IAuthDocument, userObjectId: string | ObjectId): string {
    const payload = {
      userId: userObjectId,
      uId: authData.uId,
      email: authData.email,
      username: authData.username,
      avatarColor: authData.avatarColor
    };
    const privateKey = config.JWT_TOKEN;

    return JWT.sign(payload, privateKey!);
  }
}

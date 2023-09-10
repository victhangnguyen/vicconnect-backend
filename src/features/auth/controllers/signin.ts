import { joiValidation } from "@global/decorators/joi-validation.decorator";
import { Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
//! imp services-auth
import { loginSchema } from "@auth/schemes/signin";
import { BadRequestError } from "@global/helpers/error-handler";
import { authService } from "@service/db/auth.services";
import { userService } from "@service/db/user.service";
import { IUserDocument } from "@user/interfaces/user.interface";
import { AuthController } from "./auth.controller";

export class SignIn extends AuthController {
  constructor() {
    super("SignIn");
    this.read = this.read.bind(this);
  }

  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    console.log("req.body", req.body);

    const existingAuthUser = await authService.getAuthUserByUsername(username);

    if (!existingAuthUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await existingAuthUser.comparePassword(password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingAuthUser._id}`);

    const userJWT: string = this.signToken(existingAuthUser, user._id);
    req.session = { jwt: userJWT };

    const userDocument: IUserDocument = {
      ...user,
      authId: existingAuthUser._id,
      username: existingAuthUser.username,
      email: existingAuthUser.email,
      avatarColor: existingAuthUser.avatarColor,
      uId: existingAuthUser.uId,
      createdAt: existingAuthUser.createdAt
    } as IUserDocument;

    res.status(httpStatusCodes.OK).json({ message: "User login successfully", user: userDocument, token: userJWT });
  }
}

export const signin: SignIn = new SignIn();

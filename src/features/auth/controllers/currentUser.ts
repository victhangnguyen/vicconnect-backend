import { Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserCache } from "@service/redis/user.cache";
import { IUserDocument } from "@user/interfaces/user.interface";
import { userService } from "@service/db/user.service";

const userCache: UserCache = new UserCache();

export class CurrentUser {
  constructor() {
    this.read = this.read.bind(this);
  }

  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;

    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;
    const existingUser = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.userId}`);

    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }
    res.status(httpStatusCodes.OK).json({ token, isUser, user });
  }
}

export const currentUser: CurrentUser = new CurrentUser();

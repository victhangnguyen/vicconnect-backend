import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interface";
import { signupSchema } from "@auth/schemes/signup";
import { joiValidation } from "@global/decorators/joi-validation.decorator";
import { BadRequestError } from "@global/helpers/error-handler";
import { Helpers } from "@global/helpers/helpers";
import { authService } from "@service/db/auth.services";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import JWT from "jsonwebtoken";
import { ObjectId } from "mongodb";

//! Cache
import { UserCache } from "@service/redis/user.cache";

//! imp Helpers
import { uploads } from "@global/helpers/cloudinary-upload";
import { IUserDocument } from "@user/interfaces/user.interface";
//! imp Config
import { config } from "@root/config";
import { authQueue } from "@service/queues/auth.queue";
import { userQueue } from "@service/queues/user.queue";

const userCache: UserCache = new UserCache();

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;

    const existingUser: IAuthDocument = await authService.getAuthUserByUsernameOrEmail(username, email);

    if (existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId(); //! userId
    const uId = `${Helpers.generateRandomIntegers(12)}`;

    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor
    });

    const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;

    //! check public_id
    if (!result?.public_id) {
      throw new BadRequestError("File upload: Error occurred. Try again.");
    }

    //! Add to Redis Cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;

    // saveUserToCache(key: userObjectId, userUId: uId, createdUser: userDataForCache)
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    //! convert userDataCach to userDocument with _.omit
    //! Worker transfers data to database
    console.log("__Debugger__signup\n:::SignUp.create :::userDataForCache: ", userDataForCache, "\n");
    // _.omit(userDataForCache, ["uId", "username", "email", "avatarColor", "password"]);
    // authQueue.addAuthUserJob("addAuthUserToDB", { value: userDataForCache });
    // userQueue.addUserJob("addUserToDB", { value: userDataForCache });

    authQueue.addAuthUserJob("addAuthUserToDB", { value: authData });
    userQueue.addUserJob("addUserToDB", { value: userDataForCache });

    const userJwt: string = SignUp.prototype.signToken(authData, userObjectId);
    req.session = { jwt: userJwt }; //! cookieSession

    res.status(httpStatusCodes.CREATED).json({ message: "User created successfully", user: userDataForCache, token: userJwt });
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    const payload = {
      userId: userObjectId,
      uId: data.uId,
      email: data.email,
      username: data.username,
      avatarColor: data.avatarColor
    };
    const privateKey = config.JWT_TOKEN;

    return JWT.sign(payload, privateKey!);
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }

  //! set data with initial Values for UserData
  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: "",
      blocked: [],
      blockedBy: [],
      work: "",
      location: "",
      school: "",
      quote: "",
      bgImageVersion: "",
      bgImageId: "",
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: ""
      }
    } as unknown as IUserDocument;
  }
}

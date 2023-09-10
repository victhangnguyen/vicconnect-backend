//! imp Models
import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { AuthModel } from "@auth/models/auth.schema";
import { Helpers } from "@global/helpers/helpers";

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }

  public async getAuthUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = { $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowerCase(email) }] };

    const authUser: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return authUser;
  }

  public async getAuthUserByUsername(username: string): Promise<IAuthDocument> {
    console.log("username: ", username);
    const authUser: IAuthDocument = (await AuthModel.findOne({
      username: Helpers.firstLetterUppercase(username)
    }).exec()) as IAuthDocument;
    return authUser;
  }
}

export const authService: AuthService = new AuthService();

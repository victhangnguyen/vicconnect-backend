import { Helpers } from "@global/helpers/helpers";
import { BaseCache } from "@service/redis/base.cache";
import { IUserDocument } from "@user/interfaces/user.interface";

export class UserCache extends BaseCache {
  constructor() {
    super("userCache");
  }
  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    //! userUId / uId : userId
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;

    const firstList: string[] = [
      "_id",
      `${_id}`,
      "uId",
      `${uId}`,
      "username",
      `${username}`,
      "email",
      `${email}`,
      "avatarColor",
      `${avatarColor}`,
      "createdAt",
      `${createdAt}`,
      "postsCount",
      `${postsCount}`
    ];
    const secondList: string[] = [
      "blocked",
      JSON.stringify(blocked),
      "blockedBy",
      JSON.stringify(blockedBy),
      "profilePicture",
      `${profilePicture}`,
      "followersCount",
      `${followersCount}`,
      "followingCount",
      `${followingCount}`,
      "notifications",
      JSON.stringify(notifications),
      "social",
      JSON.stringify(social)
    ];
    const thirdList: string[] = [
      "work",
      `${work}`,
      "location",
      `${location}`,
      "school",
      `${school}`,
      "quote",
      `${quote}`,
      "bgImageVersion",
      `${bgImageVersion}`,
      "bgImageId",
      `${bgImageId}`
    ];

    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      //! score: userUId (uId) - value: key (userObjectId)
      await this.client.ZADD("user", { score: parseInt(userUId, 10), value: `${key}` });
      //! And now let's save the actual documents, which is this data to save.
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      this.log.error(error); //! And then if you want to send any data to the client, we can do that. throw new ServerError("Server error. Try again")
      throw error;
    }
  }

  //! key : userId
  public async getUserFromCache(key: string): Promise<IUserDocument> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument;
      response.createdAt = new Date(Helpers.parseJSON(`${response.createdAt}`));
      response.postsCount = Helpers.parseJSON(`${response.postsCount}`);
      response.blocked = Helpers.parseJSON(`${response.blocked}`);
      response.blockedBy = Helpers.parseJSON(`${response.blockedBy}`);
      response.notifications = Helpers.parseJSON(`${response.notifications}`);
      response.social = Helpers.parseJSON(`${response.social}`);
      response.followersCount = Helpers.parseJSON(`${response.followersCount}`);
      response.followingCount = Helpers.parseJSON(`${response.followingCount}`);
      response.bgImageId = Helpers.parseJSON(`${response.bgImageId}`);
      response.bgImageVersion = Helpers.parseJSON(`${response.bgImageVersion}`);
      response.profilePicture = Helpers.parseJSON(`${response.profilePicture}`);
      response.work = Helpers.parseJSON(`${response.work}`);
      response.school = Helpers.parseJSON(`${response.school}`);
      response.location = Helpers.parseJSON(`${response.location}`);
      response.quote = Helpers.parseJSON(`${response.quote}`);

      return response;
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }
}

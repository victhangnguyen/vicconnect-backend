import { userService } from "@service/db/user.service";
import { BaseWorker } from "./base.worker";
import { DoneCallback, Job } from "bull";

class UserWorker extends BaseWorker {
  constructor() {
    super("user");
  }
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      //! add method to send data to Database
      await userService.createUserData(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();

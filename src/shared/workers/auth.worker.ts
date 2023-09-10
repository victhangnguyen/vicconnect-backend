import { BaseWorker } from "./base.worker";
import { DoneCallback, Job } from "bull";
import { authService } from "@service/db/auth.services";

class AuthWorker extends BaseWorker {
  constructor() {
    super("auth");
  }
  async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      //! add method to send data to Database
      await authService.createAuthUser(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.log.error(error);
      done(error as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();

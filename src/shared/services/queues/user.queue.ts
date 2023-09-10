import { BaseQueue } from "@service/queues/base.queue";
import { userWorker } from "@worker/user.worker";
import { IUserJob } from "@user/interfaces/user.interface";

export class UserQueue extends BaseQueue {
  constructor() {
    super("user");
    this.processJob("addUserToDB", 5, userWorker.addUserToDB);
  }

  public addUserJob(name: string, data: IUserJob): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();

// export class AuthQueue extends BaseQueue {
//   constructor() {
//     super("auth"); //! passing to pathQueueName
//     //! name: "addAuthUserToDB", concurrency: 5, callback: Queue.ProcessCallbackFunction<void>
//     //! Worker: type Bull.ProcessCallbackFunction<T> = (job: Queue.Job<T>, done: Queue.DoneCallback) => void
//     this.processJob("addAuthUserToDB", 5, authWorker.addAuthUserToDB);
//   }

//   public addAuthUserJob(name: string, data: IAuthJob): void {
//     this.addJob(name, data);
//   }
// }

// export const authQueue: AuthQueue = new AuthQueue();

import { IAuthJob } from "@auth/interfaces/auth.interface";
import { BaseQueue } from "@service/queues/base.queue";
import { authWorker } from "@worker/auth.worker";

export class AuthQueue extends BaseQueue {
  constructor() {
    super("auth"); //! passing to Queue
    //! name: "addAuthUserToDB", concurrency: 5, callback: Queue.ProcessCallbackFunction<void>
    //! Worker: type Bull.ProcessCallbackFunction<T> = (job: Queue.Job<T>, done: Queue.DoneCallback) => void
    this.processJob("addAuthUserToDB", 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();

import Logger from "bunyan";
import { config } from "@root/config";

export abstract class BaseWorker {
  log: Logger;

  constructor(workerName: string) {
    this.log = config.createLogger(`${workerName}-Worker`);
  }
}

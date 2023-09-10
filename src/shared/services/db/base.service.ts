import Logger from "bunyan";
import { config } from "@root/config";

export abstract class BaseService {
  log: Logger;
  constructor(serviceName: string) {
    this.log = config.createLogger(`${serviceName}-Service`);
  }
}

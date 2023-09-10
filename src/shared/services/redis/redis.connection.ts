import Logger from "bunyan";
import { config } from "@root/config";
import { BaseCache } from "@service/redis/base.cache";

const log: Logger = config.createLogger("redisConnection");

export class RedisConnection extends BaseCache {
  constructor() {
    super("redisConnection");
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      const res = await this.client.ping(); //! Log - ping return Promise
      log.info("client.ping: ", res);
    } catch (error) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();

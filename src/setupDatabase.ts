import mongoose from "mongoose";
import Logger from "bunyan";
//! imp config
import { config } from "@root/config";
import { redisConnection } from "@service/redis/redis.connection";

const log: Logger = config.createLogger("setupDatabase");

//! databaseConnection()
export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info("Successfully connected to database.");
        redisConnection.connect();
      })
      .catch((error) => {
        log.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};

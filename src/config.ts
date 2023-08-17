import dotenv from "dotenv";
import bunyan from "bunyan";
import defaultExport from "express";

dotenv.config({});

class Config {
  public NODE_ENV: string | undefined;
  public DATABASE_URL: string | undefined;
  public CLIENT_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public REDIS_URL: string | undefined;

  private readonly DEFAULT_DATABASE_URL = "mongodb://localhost:27017/vicconnect-backend";
  private readonly DEFAULT_CLIENT_URL = "http://localhost:3000";

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.CLIENT_URL = process.env.CLIENT_URL || this.DEFAULT_CLIENT_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "1234";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "";
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || "";
    this.REDIS_URL = process.env.REDIS_URL || "";
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      //! Array[Array[], Array[], Array[], ...]
      if (value === undefined) {
        throw new Error(`Configuration ${key} is underfined.`);
      }
    }
  }
}

export const config: Config = new Config();

import express, { Express } from "express";
//! imp setupDatabase
import { VicConnectServer } from "@root/setupServer";
//! imp databaseConnection
import databaseConnection from "@root/setupDatabase";
//! imp config
import { config } from "@root/config"; //! config instance

class Application {
  constructor() {}

  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: VicConnectServer = new VicConnectServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application = new Application();
application.initialize();

import express, { Express } from "express";
//! imp setupDatabase
import { VicConnectServer } from "./setupServer";
//! imp databaseConnection
import databaseConnection from "./setupDatabase";
//! imp config
import { config } from "./config"; //! config instance

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
  }
}

const application = new Application();
application.initialize();

import Queue, { Job } from "bull";
import Logger from "bunyan";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { config } from "@root/config";
import { IAuthJob } from "@auth/interfaces/auth.interface";

type IBaseJobData = IAuthJob;

let bullAdapters: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    //! queueName ~ collection of redis
    this.queue = new Queue(queueName, `${config.REDIS_URL}`);
    bullAdapters.push(new BullAdapter(this.queue));
    //! remove duplicate use Set
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/queues");

    createBullBoard({ queues: bullAdapters, serverAdapter: serverAdapter });
    this.log = config.createLogger(`${queueName}-Queue`);

    //! event handler - Complelted
    this.queue.on("completed", (job: Job) => {
      job.remove();
    });

    this.queue.on("global:completed", (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on("global:stalled", (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: "fixed", delay: 5000 } });
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}

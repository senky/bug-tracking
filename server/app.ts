import express from "express";
import routes from "./routes.ts";
import type { StorageAdapter } from "./storage-adapters/interface.ts";

export default (adapter: StorageAdapter) => {
  const app = express();
  app.use(express.json());
  app.use("/", routes(adapter));
  return app;
};

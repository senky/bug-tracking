import express from "express";
import routes from "./routes.ts";
import { StorageAdapter } from "./storage-adapters/interface";

export default (adapter: StorageAdapter) => {
  const app = express();
  app.use(express.json());
  app.use("/", routes(adapter));
  return app;
};

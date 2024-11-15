import express from "express";
import { body, validationResult, matchedData } from "express-validator";
import { StorageAdapter, Schema } from "./storage-adapters/interface";

export default (adapter: StorageAdapter) => {
  const router = express.Router();

  router.post(
    "/create",
    body("parentId").optional().isInt(),
    body("description").notEmpty().isString(),
    body("link").notEmpty().isURL(),
    async (req: express.Request, res: express.Response) => {
      const requestValidationResult = validationResult(req);
      if (!requestValidationResult.isEmpty()) {
        res.status(400).json({ errors: requestValidationResult.array() });
        return;
      }

      const data = matchedData<{
        parentId?: Schema["parentId"];
        description: Schema["description"];
        link: Schema["link"];
      }>(req);
      await adapter.addNewIssue(data.description, data.link, data.parentId);

      res.status(201).send();
    },
  );

  router.post("/close", (req: express.Request, res: express.Response) => {
    res.json({});
  });

  return router;
};

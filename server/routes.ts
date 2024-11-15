import express from "express";
import { body, validationResult, matchedData } from "express-validator";
import type { StorageAdapter, Schema } from "./storage-adapters/interface.ts";

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
      try {
        await adapter.addNewIssue(
          data.description,
          data.link,
          data.parentId ? Number(data.parentId) : undefined,
        );
      } catch {
        // Parent issue not found
        res.status(409).send();
        return;
      }

      res.status(201).send();
    },
  );

  router.put(
    "/close",
    body("id").notEmpty().isInt(),
    async (req: express.Request, res: express.Response) => {
      const requestValidationResult = validationResult(req);
      if (!requestValidationResult.isEmpty()) {
        res.status(400).json({ errors: requestValidationResult.array() });
        return;
      }

      const data = matchedData<{
        id: Schema["id"];
      }>(req);
      try {
        await adapter.closeIssue(Number(data.id));
      } catch {
        // Issue not found
        res.status(410).send();
        return;
      }

      res.status(204).send();
    },
  );

  return router;
};

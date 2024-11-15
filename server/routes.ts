import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/create",
  body("parentId").optional().isInt(),
  body("description").notEmpty().isString(),
  body("link").notEmpty().isURL(),
  (req: express.Request, res: express.Response) => {
    const requestValidationResult = validationResult(req);
    if (!requestValidationResult.isEmpty()) {
      res.status(400).json({ errors: requestValidationResult.array() });
      return;
    }

    // TODO: actually add row to spreadsheet

    res.status(201).send();
  },
);
router.post("/close", (req: express.Request, res: express.Response) => {
  res.json({});
});

export default router;

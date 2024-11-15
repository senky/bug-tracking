import { type StorageAdapter, columns, type Schema } from "../interface.ts";
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const __dirname = new URL(".", import.meta.url).pathname;
const dbPath = `${__dirname}/issues.csv`;

export class CsvAdapter implements StorageAdapter {
  private nextId = 1;

  // Note usage of sync API - this is important because without DB file and nextId we can't serve our clients.
  constructor() {
    let data: string;

    // Make sure CSV file exists.
    try {
      data = fs.readFileSync(dbPath, "utf-8");
    } catch {
      data = "";
      fs.writeFileSync(dbPath, data);
    }

    // Read last line for ID to generate next ID.
    const records = parse(data, { columns }) as unknown as Schema[];
    this.nextId = Number(records[records.length - 1]?.id) + 1 || 1;
  }

  async addNewIssue(
    description: string,
    link: string,
    parentId?: number,
  ): Promise<number> {
    const id = this.nextId++;

    // Make sure parent ID exists.
    if (parentId) {
      const data = await fs.promises.readFile(dbPath, "utf-8");
      const records = parse(data, { columns }) as unknown as Schema[];
      const parentExists = records.some(
        (issue) => Number(issue.id) === parentId,
      );
      if (!parentExists) {
        throw new Error("Parent issue not found");
      }
    }

    const newIssue: Schema = {
      id,
      parentId,
      description,
      link,
      status: "open",
      creationTimestamp: new Date().toISOString(),
    };
    await fs.promises.appendFile(dbPath, stringify([newIssue], { columns }));
    return id;
  }

  async closeIssue(id: number): Promise<void> {
    let issueClosed = false;

    const data = await fs.promises.readFile(dbPath, "utf-8");
    const records = parse(data, { columns }) as unknown as Schema[];
    const updatedRecords = records.map((record) => {
      if (Number(record.id) === id) {
        record.status = "closed";
        issueClosed = true;
      }
      return record;
    });

    if (!issueClosed) {
      throw new Error("Issue not found");
    }

    await fs.promises.writeFile(dbPath, stringify(updatedRecords, { columns }));
  }
}

import { StorageAdapter, columns, Schema } from "../interface";
import fs from "node:fs";
import { parse, stringify, transform } from "csv";
import { stringify as stringifySync } from "csv-stringify/sync";
import { finished } from "node:stream/promises";

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
    parse(
      data,
      {
        columns,
      },
      (err, records: Schema[]) => {
        if (err) {
          throw err;
        }
        this.nextId = Number(records[records.length - 1]?.id) + 1 || 1;
      },
    );
  }

  async addNewIssue(
    description: string,
    link: string,
    parentId?: number,
  ): Promise<number> {
    const id = this.nextId++;
    const newIssue: Schema = {
      id,
      parentId,
      description,
      link,
      status: "open",
      creationTimestamp: new Date().toISOString(),
    };
    await fs.promises.appendFile(
      dbPath,
      stringifySync([newIssue], { columns }),
    );
    return id;
  }

  async closeIssue(id: number): Promise<void> {
    let issueClosed = false;
    await finished(
      fs
        .createReadStream(dbPath)
        .pipe(parse())
        .pipe(
          transform((record) => {
            if (record.id === id) {
              record.status = "closed";
              issueClosed = true;
            }
            return record;
          }),
        )
        .pipe(stringify())
        .pipe(fs.createWriteStream(dbPath)),
    );

    if (!issueClosed) {
      throw new Error("Issue not found");
    }
  }
}

import { describe, it, expect, beforeEach } from "vitest";
import { CsvAdapter } from "./csv-adapter";
import fs from "node:fs";

const __dirname = new URL(".", import.meta.url).pathname;
const dbPath = `${__dirname}/issues.csv`;

describe("CsvAdapter", () => {
  beforeEach(() => {
    // Remove the CSV file before each test.
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  it("should create an empty CSV file if it doesn't exist", () => {
    new CsvAdapter();
    expect(fs.existsSync(dbPath)).toBe(true);
  });

  it("should add new issue", async () => {
    const adapter = new CsvAdapter();
    const id = await adapter.addNewIssue("Test", "http://example.com");
    const data = fs.readFileSync(dbPath, "utf-8");
    expect(data).toMatch(RegExp(`${id},Test,,open,.*,http://example.com\n`));
  });

  it("should correctly pick up last ID", async () => {
    fs.writeFileSync(
      dbPath,
      "4,Test,,open,2021-01-01T00:00:00.000Z,http://example.com\n",
    );
    const adapter = new CsvAdapter();
    const id = await adapter.addNewIssue("Test", "http://example.com");
    expect(id).toBe(5);
  });

  it("should be able to close issue", async () => {
    fs.writeFileSync(
      dbPath,
      "1,Test,,open,2021-01-01T00:00:00.000Z,http://example.com\n",
    );
    const adapter = new CsvAdapter();
    await adapter.closeIssue(1);
    const data = fs.readFileSync(dbPath, "utf-8");
    expect(data).toMatch(RegExp("1,Test,,closed,.*,http://example.com\n"));
  });
});

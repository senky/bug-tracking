import { StorageAdapter, Schema } from "../interface";

export class CsvTestAdapter implements StorageAdapter {
  issues: Schema[] = [];

  async addNewIssue(
    description: string,
    link: string,
    parentId?: number,
  ): Promise<number> {
    const id = Number(this.issues[this.issues.length - 1]?.id) + 1 || 1;
    this.issues.push({
      id,
      parentId,
      description,
      link,
      status: "open",
      creationTimestamp: new Date().toISOString(),
    });
    return id;
  }

  async closeIssue(id: number): Promise<void> {}
}

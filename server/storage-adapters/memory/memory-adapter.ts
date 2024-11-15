import type { StorageAdapter, Schema } from "../interface";

export class MemoryAdapter implements StorageAdapter {
  issues: Schema[] = [];

  async addNewIssue(
    description: string,
    link: string,
    parentId?: number,
  ): Promise<number> {
    // Make sure parent ID exists.
    if (parentId) {
      const parentExists = this.issues.some((issue) =>
        Number(issue.id === parentId),
      );
      if (!parentExists) {
        throw new Error("Parent issue not found");
      }
    }

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

  async closeIssue(id: number): Promise<void> {
    let issueClosed = false;
    this.issues = this.issues.map((issue) => {
      if (issue.id === id) {
        issue.status = "closed";
        issueClosed = true;
      }
      return issue;
    });
    if (!issueClosed) {
      throw new Error("Issue not found");
    }
  }
}

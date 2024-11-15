type ID = number;

export interface StorageAdapter {
  addNewIssue(
    description: string,
    link: string,
    parentId?: number,
  ): Promise<ID>;
  closeIssue(id: number): Promise<void>;
}

export type Schema = {
  id: ID;
  description: string;
  parentId?: ID;
  status: "open" | "closed";
  creationTimestamp: string;
  link: string;
};

export const columns: Array<keyof Schema> = [
  "id",
  "description",
  "parentId",
  "status",
  "creationTimestamp",
  "link",
];

import { LogType } from "./LogType";

export class LogItem {
  public type: LogType;
  public created: Date;
  public content: string;
  public tags: string[];
  public due?: Date;

  constructor(
    type: LogType,
    created: Date,
    content: string,
    tags: string[],
    due?: Date
  ) {
    this.type = type;
    this.created = created;
    this.content = content;
    this.tags = tags;
    this.due = due;
  }
}

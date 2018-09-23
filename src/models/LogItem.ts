import { LogType } from "./LogType";
import { Tag } from "./Tag";

export class LogItem {
  public type: LogType;
  public created: Date;
  public content: string;
  public tags: Tag[];
  public due?: Date;

  constructor(
    type: LogType,
    created: Date,
    content: string,
    tags: Tag[],
    due?: Date
  ) {
    this.type = type;
    this.created = created;
    this.content = content;
    this.tags = tags;
    this.due = due;
  }
}

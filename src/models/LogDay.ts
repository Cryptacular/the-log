import { LogItem } from './LogItem';

export class LogDay {
  public created: Date;
  public items: LogItem[];

  constructor(created: Date, items: LogItem[]) {
    this.created = created;
    this.items = items;
  }
}

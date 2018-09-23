import { LogItem } from "../models/LogItem";

export interface ILogService {
  Get(): LogItem[];
  Save(logs: LogItem[]): void;
}

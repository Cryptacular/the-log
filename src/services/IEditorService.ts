import { Value } from "slate";
import { LogItem } from "../models/LogItem";

export interface IEditorService {
  logToValue(logs: LogItem[]): Value;
  valueToLog(value: Value): LogItem[];
}

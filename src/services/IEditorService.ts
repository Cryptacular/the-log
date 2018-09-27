import { Value } from 'slate';
import { LogDay } from '../models/LogDay';
import { LogItem } from '../models/LogItem';

export interface IEditorService {
  logToValue(logs: LogItem[]): Value;
  logDayToValue(logs: LogDay[]): Value;
  valueToLogDay(value: Value): LogDay[];
}

import { Value } from 'slate';
import { LogDay } from '../models/LogDay';

export interface IEditorService {
  logDayToValue(logs: LogDay[]): Value;
  valueToLogDay(value: Value): LogDay[];
}

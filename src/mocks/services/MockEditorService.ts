import { Value } from 'slate';
import { LogDay } from '../../models/LogDay';
import { LogItem } from '../../models/LogItem';
import { IEditorService } from '../../services/IEditorService';

class MockEditorService implements IEditorService {
  public logToValue(logs: LogItem[]): Value {
    return Value.fromJSON({});
  }
  public logDayToValue(content: LogDay[]): Value {
    return Value.fromJSON({});
  }
  public valueToLogDay(value: Value): LogDay[] {
    return [];
  }
}

export const mockEditorService = new MockEditorService();

import { Value } from 'slate';
import { LogDay } from '../../models/LogDay';
import { IEditorService } from '../../services/IEditorService';

class MockEditorService implements IEditorService {
  public logDayToValue(content: LogDay[]): Value {
    return Value.fromJSON({});
  }
  public valueToLogDay(value: Value): LogDay[] {
    return [];
  }
}

export const mockEditorService = new MockEditorService();

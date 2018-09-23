import { Value } from "slate";
import { LogItem } from "../../models/LogItem";
import { IEditorService } from "../../services/IEditorService";

class MockEditorService implements IEditorService {
  public logToValue(content: LogItem[]): Value {
    return Value.fromJSON({});
  }
  public valueToLog(value: Value): LogItem[] {
    return [];
  }
}

export const mockEditorService = new MockEditorService();

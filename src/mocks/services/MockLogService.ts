import { LogItem } from "../../models/LogItem";
import { ILogService } from "../../services/ILogService";

class MockLogService implements ILogService {
  private logs: LogItem[] = [];

  public Get(): LogItem[] {
    return this.logs;
  }
  public Save(logs: LogItem[]): void {
    this.logs = logs;
    return;
  }
}

export const mockLogService = new MockLogService();

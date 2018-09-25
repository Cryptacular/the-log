import { initialEditorValue } from '../config/initialEditorValue';
import { LogItem } from '../models/LogItem';
import { ILogService } from './ILogService';

class LogService implements ILogService {
  public Get(): LogItem[] {
    const content = localStorage.getItem('content') || initialEditorValue;
    const logs = JSON.parse(content);
    return logs;
  }

  public Save(content: LogItem[]): void {
    localStorage.setItem('content', JSON.stringify(content));
  }
}

export const logService = new LogService();

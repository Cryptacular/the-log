import { initialEditorValue } from "../config/initialEditorValue";
import { ILogService } from "./ILogService";

class LogService implements ILogService {
  public Get(): string {
    const value = localStorage.getItem("content") || initialEditorValue;
    return value;
  }

  public Save(content: string): void {
    localStorage.setItem("content", content);
  }
}

export const logService = new LogService();

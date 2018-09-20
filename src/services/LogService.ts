import { ILog } from "../models/ILog";
import { LogType } from "../models/LogType";
import { ILogService } from "./ILogService";

class LogService implements ILogService {
  public GetAll(): ILog[] {
    return [
      {
        id: 0,
        title: "This would be a note, tyvm!",
        type: LogType.Note
      },
      {
        id: 0,
        title:
          "This is a really long note! It just keeps going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going and going...",
        type: LogType.Note
      },
      {
        id: 0,
        title: "This is an event",
        type: LogType.Event
      },
      {
        id: 0,
        title: "I need to do this",
        type: LogType.ToDo
      },
      {
        id: 0,
        title: "I've done this, yay!",
        type: LogType.Done
      }
    ];
  }
}

export const logService = new LogService();

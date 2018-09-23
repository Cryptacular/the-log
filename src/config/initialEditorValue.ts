import { LogItem } from "../models/LogItem";
import { LogType } from "../models/LogType";
import { Tag } from "../models/Tag";

const tutorialTag = new Tag(1, "tutorial");

const logs: LogItem[] = [
  new LogItem(
    LogType.Note,
    new Date(2018, 9, 22),
    "This is what a note looks like",
    [tutorialTag]
  ),
  new LogItem(
    LogType.Event,
    new Date(2018, 9, 22),
    "Whereas this is an event",
    [tutorialTag]
  ),
  new LogItem(LogType.Task, new Date(2018, 9, 22), "Add your first task here", [
    tutorialTag
  ]),
  new LogItem(
    LogType.Done,
    new Date(2018, 9, 22),
    "Then press Ctrl/Cmd+D to complete the task, like this one!",
    [tutorialTag]
  )
];

export const initialEditorValue = JSON.stringify(logs);

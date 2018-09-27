import { LogItem } from '../models/LogItem';
import { LogType } from '../models/LogType';
import { Tag } from '../models/Tag';

const tutorialTag = new Tag(1, 'tutorial');

const logs: LogItem[] = [
  new LogItem(LogType.Note, new Date(), 'This is what a note looks like', [
    tutorialTag
  ]),
  new LogItem(LogType.Event, new Date(), 'Whereas this is an event', [
    tutorialTag
  ]),
  new LogItem(LogType.Task, new Date(), 'Add your first task here', [
    tutorialTag
  ]),
  new LogItem(
    LogType.Done,
    new Date(),
    'Then press Ctrl/Cmd+D to complete the task, like this one!',
    [tutorialTag]
  )
];

export const initialEditorValue = JSON.stringify(logs);

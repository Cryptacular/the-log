import { LogItem } from '../models/LogItem';
import { LogType } from '../models/LogType';

const tags = ['tutorial'];

const logs: LogItem[] = [
  new LogItem(LogType.Note, new Date(), 'This is what a note looks like', tags),
  new LogItem(LogType.Event, new Date(), 'Whereas this is an event', tags),
  new LogItem(LogType.Task, new Date(), 'Add your first task here', tags),
  new LogItem(
    LogType.Done,
    new Date(),
    'Then press Ctrl/Cmd+D to complete the task, like this one!',
    tags
  )
];

export const initialEditorValue = JSON.stringify(logs);

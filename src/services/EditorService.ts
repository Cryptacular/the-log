import { Dictionary, groupBy } from 'lodash';
import { BlockJSON, TextJSON, Value, ValueJSON } from 'slate';
import { DateHelpers } from '../helpers/DateHelpers';
import { StringHelpers } from '../helpers/StringHelpers';
import { LogDay } from '../models/LogDay';
import { LogItem } from '../models/LogItem';
import { LogType } from '../models/LogType';
import { IEditorService } from './IEditorService';

class EditorService implements IEditorService {
  public logToValue(logs: LogItem[]): Value {
    const logDaysDictionary: Dictionary<LogItem[]> = groupBy(
      logs,
      x => x.created
    );
    const logDays: LogDay[] = [];

    for (const date in logDaysDictionary) {
      if (logDaysDictionary.hasOwnProperty(date)) {
        const created = new Date(date);
        const items = logDaysDictionary[date];
        const logDay = new LogDay(created, items);
        logDays.push(logDay);
      }
    }

    const value = this.logDayToValue(logDays);

    return value;
  }

  public logDayToValue(logs: LogDay[]): Value {
    return Value.fromJSON(convertToValue(logs));
  }

  public valueToLogDay(value: Value): LogDay[] {
    const valueJson = value.toJSON();
    return convertToLog(valueJson);
  }
}

const convertToValue = (logDays: LogDay[]): ValueJSON => {
  return {
    document: {
      nodes: logDays.map<BlockJSON>(ld => {
        return {
          data: {
            created: ld.created || DateHelpers.getTodayWithoutTime()
          },
          nodes: ld.items.map<BlockJSON>(l => {
            const tags = l.tags.map(t => `#${t}`);
            return {
              data: {
                created: l.created || DateHelpers.getTodayWithoutTime()
              },
              nodes: [
                {
                  leaves: [
                    {
                      text: `${l.content} ${tags.join(' ')}`
                    }
                  ],
                  object: 'text'
                }
              ],
              object: 'block',
              type: l.type
            };
          }),
          object: 'block',
          type: 'date'
        };
      })
    }
  };
};

const convertToLog = (value: ValueJSON): LogDay[] => {
  if (!value || !value.document || !value.document.nodes) {
    return [];
  }
  const logDays: LogDay[] = [];

  value.document.nodes.forEach(
    (n: BlockJSON): void => {
      const { type, nodes, data } = n;

      if (!type || !data || !nodes || !(nodes.length > 0)) {
        return;
      }

      const logItems: LogItem[] = [];

      nodes.forEach(
        (ld: BlockJSON): void => {
          const ldType = ld.type;
          const ldNodes = ld.nodes;
          const ldData = ld.data;

          if (!ldType || !ldData || !ldNodes || !(ldNodes.length > 0)) {
            return;
          }

          const logType = StringHelpers.toPascalCase(ldType);
          const content = ldNodes
            .map((x: TextJSON) => x.leaves.map(l => l.text).join('\n'))
            .join();
          const created = new Date(ldData.created) || DateHelpers.getTodayWithoutTime();

          const tagMatches = content.match(/#[\S]+/g);
          const tags =
            (tagMatches && tagMatches.map(tm => tm.toString().slice(1))) || [];
          const contentWithoutTags = content.replace(/#[\S]+/g, '').trim();

          const dueMatches = contentWithoutTags.match(/@[\S]+/g);
          const due =
            (dueMatches && dueMatches.map(dm => dm.toString().slice(1))) || [];
          const dueDates = due.map(d => DateHelpers.parseDateString(d, created));

          logItems.push(
            new LogItem(
              LogType[logType],
              created,
              contentWithoutTags,
              tags,
              dueDates[0]
            )
          );
        }
      );

      logDays.push(new LogDay(data.created, logItems));
    }
  );

  return logDays;
};

export const editorService = new EditorService();

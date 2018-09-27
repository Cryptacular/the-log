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
            return {
              data: {
                created: l.created || DateHelpers.getTodayWithoutTime(),
                tags: l.tags
                  ? l.tags.map(t => ({ id: t.id, name: t.name }))
                  : []
              },
              nodes: [
                {
                  leaves: [
                    {
                      text: l.content
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

          logItems.push(
            new LogItem(
              LogType[logType],
              new Date(ldData.created) || DateHelpers.getTodayWithoutTime(),
              ldNodes
                .map((x: TextJSON) => x.leaves.map(l => l.text).join('\n'))
                .join(),
              ldData.tags,
              ldData.due
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

import { BlockJSON, TextJSON, Value, ValueJSON } from 'slate';
import { StringHelpers } from '../helpers/StringHelpers';
import { LogDay } from '../models/LogDay';
import { LogItem } from '../models/LogItem';
import { LogType } from '../models/LogType';
import { IEditorService } from './IEditorService';

class EditorService implements IEditorService {
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
            created: ld.created
          },
          nodes: ld.items.map<BlockJSON>(l => {
            return {
              data: {
                created: l.created,
                tags: l.tags.map(t => ({ id: t.id, name: t.name }))
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
              ldData.created,
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

import { BlockJSON, TextJSON, Value, ValueJSON } from "slate";
import { StringHelpers } from "../helpers/StringHelpers";
import { LogItem } from "../models/LogItem";
import { LogType } from "../models/LogType";
import { IEditorService } from "./IEditorService";

class EditorService implements IEditorService {
  public logToValue(logs: LogItem[]): Value {
    return Value.fromJSON(convertToValue(logs));
  }

  public valueToLog(value: Value): LogItem[] {
    const valueJson = value.toJSON();
    return convertToLog(valueJson);
  }
}

const convertToValue = (logs: LogItem[]): ValueJSON => {
  return {
    document: {
      nodes: logs.map<BlockJSON>(l => {
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
              object: "text"
            }
          ],
          object: "block",
          type: l.type
        };
      })
    }
  };
};

const convertToLog = (value: ValueJSON): LogItem[] => {
  if (!value || !value.document || !value.document.nodes) {
    return [];
  }
  const logs = value.document.nodes.map<LogItem | null>((n: BlockJSON) => {
    const { type, nodes, data } = n;

    if (!type || !data || !nodes || !(nodes.length > 0)) {
      return null;
    }

    const logType = StringHelpers.toPascalCase(type);

    return new LogItem(
      LogType[logType],
      data.created,
      nodes.map((x: TextJSON) => x.leaves.map(l => l.text).join("\n")).join(),
      data.tags,
      data.due
    );
  });

  const out: LogItem[] = [];
  logs.forEach(l => {
    if (l !== null) {
      out.push(l);
    }
  });

  return out;
};

export const editorService = new EditorService();

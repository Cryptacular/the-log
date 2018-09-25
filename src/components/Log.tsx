import { Dictionary, groupBy } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Change, Value } from 'slate';
import { Editor, RenderNodeProps } from 'slate-react';
import { StringHelpers } from '../helpers/StringHelpers';
import { BulletType } from '../models/BulletType';
import { LogDay } from '../models/LogDay';
import { LogItem } from '../models/LogItem';
import { LogType } from '../models/LogType';
import { IEditorService } from '../services/IEditorService';
import './Log.css';

interface ILogProps {
  logs: LogItem[];
  editorService: IEditorService;
  onLogsChange: (logs: LogItem[]) => void;
}

interface ILogState {
  value: Value | null;
}

export class Log extends React.Component<ILogProps, ILogState> {
  private editorService: IEditorService;

  constructor(props: ILogProps) {
    super(props);

    this.editorService = props.editorService;

    const { logs } = props;
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

    const value =
      logs.length > 0 ? this.editorService.logDayToValue(logDays) : null;

    this.state = {
      value
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.renderNode = this.renderNode.bind(this);
  }

  public render() {
    const { value } = this.state;

    return (
      <div className="log">
        {value !== null ? (
          <Editor
            value={value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
          />
        ) : (
          'Loading'
        )}
      </div>
    );
  }

  private onChange(event: any) {
    const { value } = event;
    this.setState({
      value
    });
    const logDays = this.editorService.valueToLogDay(value);
    let logs: LogItem[] = [];
    logDays.forEach(ld => {
      logs = [...logs, ...ld.items];
    });
    this.props.onLogsChange(logs);
  }

  private onKeyDown(event: KeyboardEvent, change: Change) {
    const text = change.value.startText.getText();
    const key = (event as any).key;

    if (text.length === 0) {
      for (const type in BulletType) {
        if (BulletType.hasOwnProperty(type)) {
          const char = BulletType[type];
          if (char === key) {
            change.setBlocks(type);
            event.preventDefault();
            break;
          }
        }
      }

      if (key === ' ') {
        event.preventDefault();
      }
    }

    if (key === 'd' && (event.ctrlKey || event.metaKey)) {
      const currentBlocks = change.value.blocks;

      if (currentBlocks.some(b => !!b && b.type === 'task')) {
        change.setBlocks('done');
      } else if (currentBlocks.some(b => !!b && b.type === 'done')) {
        change.setBlocks('task');
      }
    }
  }

  private renderNode(props: RenderNodeProps) {
    const node = props.node as any;
    const { type, data } = node;
    const logType = StringHelpers.toPascalCase(type);

    const created: string = data.get('created');
    const createdDate = new Date(created);

    const output =
      type === LogType.Date ? (
        <div>
          <div className="log-date">{moment(createdDate).calendar()}</div>
          <div {...props} />
        </div>
      ) : (
        <div className="log-itemContainer">
          <span className="log-type">
            <span>{BulletType[logType]}</span>
            <span>&nbsp;</span>
          </span>
          <span
            {...props}
            className={`log-item log-item--${logType.toLowerCase()}`}
          />
        </div>
      );

    return output;
  }
}

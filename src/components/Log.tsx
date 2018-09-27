import * as moment from 'moment';
import * as React from 'react';
import { Change, Value } from 'slate';
import { Editor, RenderNodeProps } from 'slate-react';
import { DateHelpers } from '../helpers/DateHelpers';
import { StringHelpers } from '../helpers/StringHelpers';
import { BulletType } from '../models/BulletType';
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
    const value = this.editorService.logToValue(logs);

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

    const currentBlocks = change.value.blocks;

    if (key === 'd' && (event.ctrlKey || event.metaKey)) {
      if (currentBlocks.some(b => !!b && b.type === 'task')) {
        change.setBlocks('done');
      } else if (currentBlocks.some(b => !!b && b.type === 'done')) {
        change.setBlocks('task');
      }
    }

    if (key === 'Enter') {
      currentBlocks.forEach(
        b =>
          !!b &&
          b.data.set('created', DateHelpers.getTodayWithoutTime().toString())
      );
    }
  }

  private renderNode(props: RenderNodeProps) {
    const node = props.node as any;
    const { type, data } = node;
    const logType = StringHelpers.toPascalCase(type);

    const created: string = data.get('created');

    const output =
      type === LogType.Date ? (
        <div>
          <div className="log-date">
            {
              moment(created)
                .calendar()
                .split(' ')[0]
            }
          </div>
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

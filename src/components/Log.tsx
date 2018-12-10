import * as moment from 'moment';
import * as React from 'react';
import { Change, Decoration, Node, Value } from 'slate';
import { Editor, RenderMarkProps, RenderNodeProps } from 'slate-react';
import { DateHelpers } from '../helpers/DateHelpers';
import { StringHelpers } from '../helpers/StringHelpers';
import { BulletType } from '../models/BulletType';
import { LogItem } from '../models/LogItem';
import { LogType } from '../models/LogType';
import { IEditorService } from '../services/IEditorService';
import './Log.css';
import { DueDateMark } from './marks/DueDateMark';
import { TagMark } from './marks/TagMark';

interface ILogProps {
  logs: LogItem[];
  editorService: IEditorService;
  shouldLogsUpdate: boolean;
  onLogsChange: (logs: LogItem[]) => void;
  onLogsUpdated: () => void;
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
    this.renderMark = this.renderMark.bind(this);
    this.decorateNode = this.decorateNode.bind(this);
  }

  public componentDidMount() {
    const scrollable = document.getElementById('scrollableLog');
    if (scrollable) {
      scrollable.scrollBy(0, scrollable.scrollHeight);
    }
  }

  public componentWillReceiveProps(props: ILogProps) {
    const { shouldLogsUpdate, logs, onLogsUpdated } = props;
    if (shouldLogsUpdate) {
      this.setState({ value: this.editorService.logToValue(logs) });
      onLogsUpdated();
    }
  }

  public render() {
    const { value } = this.state;

    return (
      <div className="log" id="scrollableLog">
        {value !== null ? (
          <Editor
            value={value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
            decorateNode={this.decorateNode}
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
                .split('at')[0]
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

  private renderMark(props: RenderMarkProps) {
    switch (props.mark.type) {
      case 'tag':
        return <TagMark {...props} />;
      case 'due':
        return <DueDateMark {...props} />;
    }

    return;
  }

  private decorateNode(node: Node): Decoration[] | void {
    if (node.object !== 'block') {
      return;
    }

    const text = node.text;
    const texts = node.getTexts().toArray();
    const startText = texts.shift();

    if (!startText) {
      return;
    }

    const decorations: Decoration[] = [];

    for (let i = 0; i < text.length; i++) {
      const currentChar = text[i];
      if (currentChar === '#') {
        const start = i;
        const remainingString = text.substr(start);
        const endOfTag = remainingString.indexOf(' ');
        const end = endOfTag > 0 ? start + endOfTag : text.length;

        const decoration = Decoration.fromJSON({
          anchor: {
            key: startText.key,
            object: 'point',
            offset: start
          },
          focus: {
            key: startText.key,
            object: 'point',
            offset: end
          },
          mark: { type: 'tag' }
        });
        decorations.push(decoration);
      } else if (currentChar === '@') {
        const start = i;
        const remainingString = text.substr(start);
        const endOfDue = remainingString.indexOf(' ');
        const end = endOfDue > 0 ? start + endOfDue : text.length;

        const decoration = Decoration.fromJSON({
          anchor: {
            key: startText.key,
            object: 'point',
            offset: start
          },
          focus: {
            key: startText.key,
            object: 'point',
            offset: end
          },
          mark: { type: 'due' }
        });
        decorations.push(decoration);
      }
    }

    return decorations;
  }
}

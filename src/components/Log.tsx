import * as React from "react";
import { Change, Value } from "slate";
import { Editor, RenderNodeProps } from "slate-react";
import { logTypes } from "../config/logTypes";
import { ILogService } from "../services/ILogService";
import "./Log.css";

interface ILogProps {
  logService: ILogService;
}

interface ILogState {
  editorValue: Value;
}

export class Log extends React.Component<ILogProps, ILogState> {
  private logService: ILogService;

  constructor(props: ILogProps) {
    super(props);
    this.logService = props.logService;
    const initialValue = this.logService.Get();
    this.state = {
      editorValue: Value.fromJSON(JSON.parse(initialValue))
    };
    this.onChange = this.onChange.bind(this);
  }

  public render() {
    const { editorValue } = this.state;
    return (
      <div className="log">
        <Editor
          value={editorValue}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
        />
      </div>
    );
  }

  private onChange(e: any) {
    const { value } = e;
    this.setState({
      editorValue: value
    });
    const content = JSON.stringify(value.toJSON());
    this.logService.Save(content);
  }

  private onKeyDown(event: KeyboardEvent, change: Change) {
    const text = change.value.startText.getText();
    const key = (event as any).key;

    if (text.length === 0) {
      for (const type in logTypes) {
        if (logTypes.hasOwnProperty(type)) {
          const char = logTypes[type];
          if (char === key) {
            change.setBlocks(type);
            event.preventDefault();
            break;
          }
        }
      }

      if (key === " ") {
        event.preventDefault();
      }
    }

    if (key === "d" && (event.ctrlKey || event.metaKey)) {
      const currentBlocks = change.value.blocks;

      if (currentBlocks.some(b => !!b && b.type === "task")) {
        change.setBlocks("done");
      } else if (currentBlocks.some(b => !!b && b.type === "done")) {
        change.setBlocks("task");
      }
    }
  }

  private renderNode(props: RenderNodeProps) {
    const node = props.node as any;
    const logType = node.type;

    return (
      <div className="log-itemContainer">
        <span className="log-type">
          {logTypes[logType]}
          &nbsp;
        </span>
        <span {...props} className={`log-item log-item--${logType}`} />
      </div>
    );
  }
}

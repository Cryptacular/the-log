import * as React from "react";
import { Change, Value } from "slate";
import { Editor, RenderNodeProps } from "slate-react";
import { StringHelpers } from "../helpers/StringHelpers";
import { BulletType } from "../models/BulletType";
import "./Log.css";

interface ILogProps {
  value: Value;
  onChange: (event: any) => void;
  onKeyDown: (event: KeyboardEvent, change: Change) => void;
}

export class Log extends React.Component<ILogProps> {
  constructor(props: ILogProps) {
    super(props);
  }

  public render() {
    const { value, onChange, onKeyDown } = this.props;
    return (
      <div className="log">
        <Editor
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          renderNode={this.renderNode}
        />
      </div>
    );
  }

  private renderNode(props: RenderNodeProps) {
    const node = props.node as any;
    const logType = StringHelpers.toPascalCase(node.type);

    return (
      <div className="log-itemContainer">
        <span className="log-type">
          {BulletType[logType]}
          &nbsp;
        </span>
        <span
          {...props}
          className={`log-item log-item--${logType.toLowerCase()}`}
        />
      </div>
    );
  }
}

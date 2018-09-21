import * as React from "react";
import { Change, Value } from "slate";
import { Editor, RenderNodeProps } from "slate-react";
import { ILog } from "../models/ILog";
import { ILogService } from "../services/ILogService";
import "./Log.css";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        nodes: [
          {
            leaves: [
              {
                text: "A line of text in a paragraph."
              }
            ],
            object: "text"
          }
        ],
        object: "block",
        type: "paragraph"
      }
    ]
  }
});

interface ILogProps {
  logService: ILogService;
}

interface ILogState {
  logs: ILog[];
  editorValue: Value;
}

export class Log extends React.Component<ILogProps, ILogState> {
  private logService: ILogService;

  constructor(props: ILogProps) {
    super(props);
    this.logService = props.logService;
    this.state = {
      editorValue: initialValue,
      logs: []
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

  public componentDidMount() {
    const logs = this.logService.GetAll();
    this.setState({
      logs
    });
  }

  private onChange(e: any) {
    const { value } = e;
    this.setState({
      editorValue: value
    });
  }

  private onKeyDown(event: Event, change: Change) {
    const text = change.value.focusText;
    if (
      text.getText() !== "- " ||
      change.value.blocks.some(
        block => block !== undefined && block.type === "list"
      )
    ) {
      return;
    }
    event.preventDefault();
    change.setBlocks("list");
  }

  private renderNode(props: RenderNodeProps) {
    switch ((props.node as any).type) {
      case "list":
        return <div {...props} className="log log--note" />;
      default:
        return;
    }
  }
}

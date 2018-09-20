import * as React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";
import { ILog } from "../models/ILog";
import { ILogService } from "../services/ILogService";
// import { LogRenderer } from "./LogRenderer";

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
        <Editor value={editorValue} onChange={this.onChange} />
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
}

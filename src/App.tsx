import * as React from "react";
import { Change, Value } from "slate";
import "./App.css";
import { Log } from "./components/Log";
import { Tasks } from "./components/Tasks";
import { BulletType } from "./models/BulletType";
import { LogItem } from "./models/LogItem";
import { LogType } from "./models/LogType";
import { IEditorService } from "./services/IEditorService";
import { ILogService } from "./services/ILogService";

interface IAppProps {
  logService: ILogService;
  editorService: IEditorService;
}

interface IAppState {
  logs: LogItem[];
  editorValue: Value | null;
}

class App extends React.Component<IAppProps, IAppState> {
  private logService: ILogService;
  private editorService: IEditorService;

  constructor(props: IAppProps) {
    super(props);
    this.logService = props.logService;
    this.editorService = props.editorService;
    this.state = {
      editorValue: null,
      logs: []
    };

    this.onEditorChange = this.onEditorChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  public render() {
    const { editorValue, logs } = this.state;

    return editorValue !== null ? (
      <div className="grid">
        <div className="grid-section grid-section--log">
          <div className="log-title">Log</div>
          <Log
            value={editorValue}
            onChange={this.onEditorChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
        <div className="grid-section grid-section--filter grid-section--right">
          <div className="log-title">Filter</div>
        </div>
        <div className="grid-section grid-section--tasks grid-section--right">
          <div className="log-title">Tasks</div>
          <Tasks tasks={logs.filter(l => l.type === LogType.Task)} />
        </div>
      </div>
    ) : (
      <div>"Loading"</div>
    );
  }

  public componentDidMount() {
    const logs = this.logService.Get();
    const editorValue = this.editorService.logToValue(logs);
    this.setState({ logs, editorValue });
  }

  private onEditorChange(event: any) {
    const { value } = event;
    const logs = this.editorService.valueToLog(value);
    this.setState({
      editorValue: value,
      logs
    });
    this.logService.Save(logs);
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
}

export default App;

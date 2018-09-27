import * as React from 'react';
import './App.css';
import { Log } from './components/Log';
import { Tasks } from './components/Tasks';
import { DateHelpers } from './helpers/DateHelpers';
import { LogItem } from './models/LogItem';
import { LogType } from './models/LogType';
import { IEditorService } from './services/IEditorService';
import { ILogService } from './services/ILogService';

interface IAppProps {
  logService: ILogService;
  editorService: IEditorService;
}

interface IAppState {
  logs: LogItem[];
}

class App extends React.Component<IAppProps, IAppState> {
  private logService: ILogService;
  private editorService: IEditorService;

  constructor(props: IAppProps) {
    super(props);

    this.logService = props.logService;
    this.editorService = props.editorService;

    this.state = {
      logs: []
    };

    this.onChange = this.onChange.bind(this);
  }

  public render() {
    const { logs } = this.state;

    return logs.length > 0 ? (
      <div className="grid">
        <div className="grid-section grid-section--log">
          <div className="log-title">Log</div>
          <Log
            logs={logs}
            editorService={this.editorService}
            onLogsChange={this.onChange}
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
    this.setState({ logs });
  }

  private onChange(logs: LogItem[]): void {
    const hasNewLog = logs.length > this.state.logs.length;

    if (hasNewLog) {
      const lastLog = logs[logs.length - 1];
      lastLog.created = DateHelpers.getTodayWithoutTime();
    }

    this.logService.Save(logs);
    this.setState({ logs });
  }
}

export default App;

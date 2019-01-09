import * as moment from 'moment';
import 'moment/locale/en-nz';
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
  shouldLogsUpdate: boolean;
}

class App extends React.Component<IAppProps, IAppState> {
  private logService: ILogService;
  private editorService: IEditorService;

  constructor(props: IAppProps) {
    super(props);

    this.logService = props.logService;
    this.editorService = props.editorService;

    this.state = {
      logs: [],
      shouldLogsUpdate: false
    };

    this.onChange = this.onChange.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.onLogsUpdated = this.onLogsUpdated.bind(this);

    moment.locale('en-nz');
  }

  public render() {
    const { logs, shouldLogsUpdate } = this.state;
    let tags: string[] = [];
    logs.forEach(l => {
      const newTags: string[] = [];

      l.tags.forEach(lt => {
        if (!tags.some(t => t === lt)) {
          newTags.push(lt);
        }
      });

      if (newTags.length > 0) {
        tags = [...tags, ...newTags];
      }
    });

    return logs.length > 0 ? (
      <div className="grid">
        <div className="grid-section grid-section--log">
          <div className="log-title">Log</div>
          <Log
            logs={logs}
            editorService={this.editorService}
            shouldLogsUpdate={shouldLogsUpdate}
            onLogsChange={this.onChange}
            onLogsUpdated={this.onLogsUpdated}
          />
        </div>
        <div className="grid-section grid-section--tasks grid-section--right">
          <div className="log-title">Tasks</div>
          <Tasks
            tasks={logs.filter(l => l.type === LogType.Task)}
            onComplete={this.completeTask}
          />
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

  private completeTask(id: number) {
    const logs = [...this.state.logs];

    for (const log of logs) {
      if (log.id === id) {
        log.type = LogType.Done;
        break;
      }
    }

    this.logService.Save(logs);
    this.setState({ logs, shouldLogsUpdate: true });
  }

  private onLogsUpdated() {
    this.setState({
      shouldLogsUpdate: false
    });
  }
}

export default App;

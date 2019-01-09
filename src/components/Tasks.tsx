import * as moment from 'moment';
import * as React from 'react';
import { DateHelpers } from '../helpers/DateHelpers';
import { BulletType } from '../models/BulletType';
import { LogItem } from '../models/LogItem';
import { TagMark } from './marks/TagMark';

interface ITasksProps {
  tasks: LogItem[];
  onComplete: (id: number) => void;
}

export class Tasks extends React.Component<ITasksProps> {
  constructor(props: ITasksProps) {
    super(props);
    this.onBulletClick = this.onBulletClick.bind(this);
  }

  public componentDidMount() {
    const scrollable = document.getElementById('scrollableTasks');
    if (scrollable) {
      scrollable.scrollBy(0, scrollable.scrollHeight);
    }
  }

  public render() {
    let items: LogItem[] = [];
    const tasks = this.filterByDueDate(this.getValidTasks());
    const dates = tasks.entries();

    while (true) {
      const next = dates.next();
      if (next.done) {
        break;
      }

      items = [...items, ...next.value[1]];
    }

    items = items.sort((a, b) => (!a.due || (b.due && a.due > b.due) ? -1 : 1));
    const displayedDates: string[] = [];

    return (
      <div className="log" id="scrollableTasks">
        {items.map((t, i) => {
          let shouldDisplayDate = false;
          let dateDisplayName = '';

          if (t.due) {
            dateDisplayName =
              t.due > DateHelpers.getDateOneMonthFromNow()
                ? moment(t.due).fromNow()
                : moment(t.due)
                    .calendar()
                    .split('at')[0];
            shouldDisplayDate = displayedDates.indexOf(dateDisplayName) < 0;
            displayedDates.push(dateDisplayName);
          }

          return (
            <div key={`task-${t.created}-${i}`}>
              {shouldDisplayDate && (
                <div className="log-date">{dateDisplayName}</div>
              )}
              <div className="log-itemContainer">
                <span className="log-type">
                  <a
                    className="logType-icon"
                    onClick={this.onBulletClick}
                    data-id={`${t.id}`}
                  >
                    {BulletType.Task}
                  </a>
                  <span>&nbsp;</span>
                </span>
                <span className="log-item log-item--task">
                  {t.content.replace(/\s+@\S+/g, '').trim()}
                  {t.tags.map(tt => (
                    <span>
                      {' '}
                      <TagMark key={`${i}-${tt}`}>#{tt}</TagMark>
                    </span>
                  ))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  private getValidTasks(): LogItem[] {
    const { tasks } = this.props;
    return tasks.filter(t => t.content.length > 0);
  }

  private filterByDueDate(tasks: LogItem[]): Map<Date, LogItem[]> {
    const tasksByDueDate = new Map<Date, LogItem[]>();

    const zeroDate = DateHelpers.getZeroDate();
    tasks.forEach(t => {
      const date = t.due || zeroDate;

      const currentValue = tasksByDueDate.get(date);
      tasksByDueDate.set(date, (currentValue && [...currentValue, t]) || [t]);
    });

    return tasksByDueDate;
  }

  private onBulletClick(e: any) {
    this.props.onComplete(parseInt(e.target.dataset.id, 10));
  }
}

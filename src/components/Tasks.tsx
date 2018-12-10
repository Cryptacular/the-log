import * as moment from 'moment';
import * as React from 'react';
import { DateHelpers } from '../helpers/DateHelpers';
import { BulletType } from '../models/BulletType';
import { LogItem } from '../models/LogItem';
import { TagMark } from './marks/TagMark';

interface ITasksProps {
  tasks: LogItem[];
}

export class Tasks extends React.Component<ITasksProps> {
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

    items = items.sort((a, b) => (!a.due || (b.due && a.due < b.due) ? -1 : 1));
    const displayedDates: string[] = [];

    return (
      <div className="log">
        {items.map((t, i) => {
          let shouldDisplayDate = false;
          let dateDisplayName = '';

          if (t.due) {
            dateDisplayName = moment(t.due).fromNow(true);
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
                  <span>{BulletType.Task}</span>
                  <span>&nbsp;</span>
                </span>
                <span className="log-item log-item--task">
                  {t.content}
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
}

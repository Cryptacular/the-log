import * as moment from 'moment';

export const DateHelpers = {
  getTodayWithoutTime(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  getTomorrowWithoutTime(): Date {
    const tomorrow = moment('tomorrow').toDate();
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  },

  getDateOneMonthFromNow(): Date {
    const nextMonth = moment('in 30 days').toDate();
    nextMonth.setHours(0, 0, 0, 0);
    return nextMonth;
  },

  parseDateString(date: string, created: Date): Date {
    if (customDateIdentifiers.hasOwnProperty(date.toLowerCase())) {
      return customDateIdentifiers[date](created);
    }

    if (daysInWeek.hasOwnProperty(date.toLowerCase())) {
      return getWeek(created)
        .filter(d => d.day() === daysInWeek[date.toLowerCase()])[0]
        .toDate();
    }

    const parsed = moment(date);
    if (parsed.isValid()) {
      return parsed.toDate();
    }
    return zeroDate;
  },

  getZeroDate(): Date {
    return zeroDate;
  }
};

const zeroDate = new Date(0, 0);

const getWeek = (from: Date) => {
  const current = moment(from);
  const date = current.date();
  const dates = [];

  for (let i = 0; i < 8; i++) {
    dates.push(moment(current).date(date + i));
  }

  return dates;
};

const customDateIdentifiers: object = {
  today: (created: Date) => getWeek(created)[0].toDate(),
  tomorrow: (created: Date) => getWeek(created)[1].toDate()
};

const daysInWeek: object = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

import * as moment from 'moment';

export const DateHelpers = {
  getTodayWithoutTime(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  parseDateString(date: string): Date {
    if (customDateIdentifiers.hasOwnProperty(date.toLowerCase())) {
      return customDateIdentifiers[date];
    }

    if (daysInWeek.hasOwnProperty(date.toLowerCase())) {
      return week
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

const week = (() => {
  const today = moment();
  today
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const date = today.date();
  const dates = [];

  for (let i = 0; i < 8; i++) {
    dates.push(moment(today).date(date + i));
  }

  return dates;
})();

const customDateIdentifiers: object = {
  today: week[0].toDate(),
  tomorrow: week[1].toDate()
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

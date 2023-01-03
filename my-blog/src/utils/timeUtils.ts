export const getMonthList = (curTime: Date = new Date()) => {
  // 获取当月第一天是星期几
  const toDay = {
    year: curTime.getFullYear(),
    month: curTime.getMonth() + 1,
  };
  curTime.setDate(1);
  const startWeek = curTime.getDay();
  const prevMonth = new Date(toDay.year, toDay.month - 1, 0);
  const curMonth = new Date(toDay.year, toDay.month, 0);
  const nextMonth = new Date(toDay.year, toDay.month + 1, 0);
  const prevDays = prevMonth.getDate();
  const curDays = curMonth.getDate();
  const endWeek = curMonth.getDay();
  const timeArr = [];
  if (startWeek > 0) {
    for (let i = 0; i < startWeek; i++) {
      timeArr.push({
        month: prevMonth.getMonth() + 1,
        week: i,
        day: prevDays - (startWeek - i - 1),
        year: prevMonth.getFullYear(),
      });
    }
  }
  for (let i = 0; i < curDays; i++) {
    timeArr.push({
      month: curMonth.getMonth() + 1,
      week: startWeek + (i % 7),
      day: i + 1,
      year: curMonth.getFullYear(),
    });
  }
  if (endWeek < 6) {
    for (let i = endWeek + 1; i <= 6; i++) {
      timeArr.push({
        month: curMonth.getMonth() + 2,
        week: i,
        day: i - endWeek,
        year: nextMonth.getFullYear(),
      });
    }
  }
  return timeArr;
};

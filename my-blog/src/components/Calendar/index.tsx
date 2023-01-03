import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { getMonthList } from '@/utils/timeUtils';

const head = ['日', '一', '二', '三', '四', '五', '六'];
interface Props {
  time?: Date;
}
const Calendar: React.FC<Props> = (props) => {
  const { time } = props;
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setDate(new Date());
  }, []);
  useEffect(() => {
    if (time) {
      setDate(time);
    }
  }, [time]);
  const { year, month, day } = useMemo(() => {
    if (date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
    return {};
  }, [date]);
  const timers = useMemo(() => {
    // 获取当月第一天是星期几
    const timeArr = getMonthList();
    return timeArr;
  }, [date]);
  return (
    <div className={styles.calenderWrapper}>
      <div className={styles.curDay}>
        <span className={styles.year}>{year}</span>年
        <span className={styles.month}>{month}</span>月
      </div>
      <div className={styles.calenderBody}>
        <div className={styles.header}>
          {head.map((item) => (
            <div className={styles.timeName} key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className={styles.dayList}>
          {timers.map((item, i) => (
            <div
              key={i}
              className={classNames(styles.dayItem, {
                [styles.noCur]: item.month !== month,
                [styles.active]: item.month === month && item.day === day,
              })}
            >
              {item.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Calendar;

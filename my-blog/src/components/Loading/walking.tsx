import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import classNames from 'classnames';

interface Props {
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
const Walking: React.FC<Props> = ({ loading, className, style }) => {
  const animationTime = 1000 * 10; // 动画持续时间
  const [startTime, setStartTime] = useState<Date>();
  const [hide, setHide] = useState(true);
  const [hideDome, setHideDome] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (loading) {
      setStartTime(state => !state ? new Date() : undefined);
      setHide(false);
    } else {
      if (startTime) {
        const endTime = new Date();
        const diff = endTime.getTime() - startTime.getTime();
        if (diff >= animationTime) {
          setStartTime(undefined);
          setHide(true);
        } else {
          if (timer.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => {
            setHide(true);
            setStartTime(undefined);
          }, animationTime - diff);
        }
      }
    }
  }, [loading]);
  useEffect(() => {
    if (startTime) {
      if (hide) {
        // 延迟去除dom元素
        setTimeout(() => {
          setHideDome(true);
        }, 1000);
      } else {
        setHideDome(false);
      }
    }
  }, [startTime, hide])
  return !hideDome ? <div className={classNames(styles.walking, className)} style={{ height: hide ? 0 : 75, ...style }}>
    <img src="/img/run.gif" alt="" />
    <div className={styles.loader}></div>
  </div> : <div />;
}
export default Walking;

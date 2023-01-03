import classNames from 'classnames';
import React, { useState } from 'react';
import { useEffect } from 'react';
import styles from './index.less';

interface Props {
  children: number;
  refresh: boolean;
  onCountOverCaller?: () => void;
  countTime?: number;
}
const CountDown: React.FC<Props> = (props) => {
  const { refresh } = props;
  const [show, setShow] = useState(true);
  const [count, setCount] = useState<number>();
  useEffect(() => {
    let init = props.children;
    setCount(init);
    setShow(false);
    let timer: any;
    setTimeout(() => {
      setShow(true);
      timer = setInterval(() => {
        if (init > 0) {
          setCount(init--);
        } else {
          setCount(init);
          init = props.children;
          clearInterval(timer);
        }
      }, 1000);
    }, 500);
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [refresh]);
  useEffect(() => {
    if (count === 0) {
      props.onCountOverCaller?.();
    }
  }, [count]);
  return (
    <div className={styles.circleWrapper}>
      <div className={classNames(styles.wrapper, styles.right)}>
        <div
          className={classNames(styles.circle, styles.rightcircle)}
          style={
            show
              ? {
                  animationName: styles.circle_right,
                  animationDuration: `${props.countTime || 30}s`,
                  animationDelay: '1.5s',
                }
              : {}
          }
        ></div>
      </div>
      <div className={classNames(styles.wrapper, styles.left)}>
        <div
          className={classNames(styles.circle, styles.leftcircle)}
          id="leftcircle"
          style={
            show
              ? {
                  animationName: styles.circle_left,
                  animationDuration: `${props.countTime || 30}s`,
                  animationDelay: '1.5s',
                }
              : {}
          }
        ></div>
      </div>
      <div className={styles.number}>
        <span>{count}</span>S
      </div>
    </div>
  );
};
export default CountDown;

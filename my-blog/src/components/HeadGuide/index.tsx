import _ from 'lodash';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface Props {}
const HeadGuide: React.FC<Props> = (props) => {
  const [left, setLeft] = useState({
    top: 0,
    maxTop: -2,
    minTop: 2,
    left: 0,
    maxLeft: 12,
    minLeft: 0,
  });
  const [right, setRight] = useState({
    top: -3.2,
    maxTop: -5.2,
    minTop: -1.2,
    left: 0,
    maxLeft: 12,
    minLeft: 0,
  });
  useEffect(() => {
    const leftx = (window.innerWidth - 920) / 4;
    const lefty = window.innerHeight - (242 / 2 + 50);
    console.log('leftx,lefty', leftx, lefty);
    document.addEventListener('mousemove', (e) => {
      const { pageX, pageY } = e;
      // console.log('pagex,pagey', pageX, pageY);
      const _left = _.cloneDeep(left);
      const _right = _.cloneDeep(right);
      if (pageX > leftx && pageY < lefty) {
        // 右上角
        const diffx = pageX - leftx;
        const diffy = lefty - pageY;
        const ratex = diffx / 920;
        const ratey = diffy / 920;
        _left.top += ratey * (_left.maxTop - _left.top);
        _left.top = _left.top <= _left.maxTop ? _left.maxTop : _left.top;
        _left.left += ratex * (_left.maxLeft - _left.left);
        _left.left = _left.left >= _left.maxLeft ? _left.maxLeft : _left.left;
        _right.top += ratey * (_right.maxTop - _right.top);
        _right.top = _right.top <= _right.maxTop ? _right.maxTop : _right.top;
        _right.left += ratex * (_right.maxLeft - _right.left);
        _right.left =
          _right.left >= _right.maxLeft ? _right.maxLeft : _right.left;
        setLeft(_left);
        setRight(_right);
      } else if (pageY > lefty && pageX > leftx) {
        // 右下角
        const diffx = pageX - leftx;
        const diffy = pageY - lefty;
        const ratex = diffx / 920;
        const ratey = diffy / 200;
        _left.top -= ratey * (_left.top - _left.minTop);
        _left.top = _left.top >= _left.minTop ? _left.minTop : _left.top;
        _left.left += ratex * (_left.maxLeft - _left.left);
        _left.left = _left.left >= _left.maxLeft ? _left.maxLeft : _left.left;
        _right.top -= ratey * (_right.top - _right.minTop);
        _right.top = _right.top >= _right.minTop ? _right.minTop : _right.top;
        _right.left += ratex * (_right.maxLeft - _right.left);
        _right.left =
          _right.left >= _right.maxLeft ? _right.maxLeft : _right.left;
        setLeft(_left);
        setRight(_right);
      }
    });
  }, []);
  return (
    <div
      className={styles.guideWrapper}
      style={{
        left: window.innerWidth < 1120 ? 0 : '',
      }}
    >
      <img src={require('../../static/img/toux_c.png')} />
      <div className={styles.eyes}>
        <div
          className={classNames(styles.eye, styles.left)}
          style={{ top: left.top, left: left.left }}
        ></div>
        <div
          className={classNames(styles.eye, styles.right)}
          style={{ top: right.top, left: right.left }}
        ></div>
      </div>
      <div className={styles.smile}>
        <div className={styles.teeth}></div>
        <div className={styles.tongue}></div>
      </div>
    </div>
  );
};
export default HeadGuide;

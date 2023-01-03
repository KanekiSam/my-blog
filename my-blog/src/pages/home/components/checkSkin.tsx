import { TokenUtils } from '@/utils/token';
import { Drawer } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import styles from '../index.less';

interface Props {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
}
const CheckSkinDrawer: React.FC<Props> = (props) => {
  const { onRefresh, visible, onClose } = props;
  return (
    <Drawer
      title="选择皮肤"
      placement={'bottom'}
      onClose={() => onClose()}
      visible={visible}
      key={'bottom'}
      className={styles.skinDrawer}
    >
      <div className={styles.flexWrapper}>
        <div
          className={classNames(styles.item, {
            [styles.active]: !TokenUtils.getTheme(),
          })}
          onClick={() => {
            if (!TokenUtils.getTheme()) {
              return;
            }
            TokenUtils.clearTheme();
            onRefresh();
            onClose();
          }}
        >
          <img src={require('../../../static/img/theme.png')} />
          <div>白色</div>
        </div>
        <div
          className={classNames(styles.item, {
            [styles.active]: TokenUtils.getTheme() === 'dark',
          })}
          onClick={() => {
            if (TokenUtils.getTheme() === 'dark') {
              return;
            }
            TokenUtils.setToken({ bigBtheme: 'dark' });
            onRefresh();
            onClose();
          }}
        >
          <img src={require('../../../static/img/theme1.png')} />
          <div>黑色</div>
        </div>
      </div>
    </Drawer>
  );
};
export default CheckSkinDrawer;

import React, { ReactNode } from 'react';
import Drawer from 'rc-drawer';
import classNames from 'classnames';
import 'rc-drawer/assets/index.css';
import styles from '../index.less';
import { KeyOutlined } from '@ant-design/icons';
import { useLocation, useModel } from 'umi';

interface Props {
  visible: boolean;
  navList: { tab: string; icon: ReactNode; onClick?: () => void }[];
  onClose?: () => void;
  active: number;
}
const NavDrawer: React.FC<Props> = (props) => {
  const { visible, onClose, navList, active } = props;
  const _location: any = useLocation() || {};
  const { query } = _location;
  const { setShowLogin } = useModel('global', (model) => ({
    setShowLogin: model.setShowLogin,
  }));
  return (
    <Drawer
      open={visible}
      onClose={() => {
        onClose?.();
      }}
      width={250}
      placement="right"
      handler={false}
    >
      <div className={styles.drawerWrapper}>
        <div className={styles.bannerTitle}>博客导航</div>
        <div className={styles.navList}>
          {navList.map((item, index) => (
            <div
              className={classNames(styles.navItem, {
                [styles.active]: index === active,
              })}
              key={item.tab}
              onClick={() => {
                item.onClick?.();
                props.onClose?.();
              }}
            >
              {item.icon} {item.tab}
            </div>
          ))}
        </div>
        {query.login === 'bigB' ? (
          <div
            className={styles.loginBtn}
            onClick={() => {
              setShowLogin(true);
              onClose?.();
            }}
          >
            <KeyOutlined className={styles.icon} />
            登录/注册
          </div>
        ) : (
          ''
        )}
      </div>
    </Drawer>
  );
};
export default NavDrawer;

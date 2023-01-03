import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { CaretUpOutlined, MenuOutlined, RightOutlined } from '@ant-design/icons';
import styles from './index.less';
import RightSide from './components/rightSide';
import LeftSide from './components/leftSide';
import { httpGet } from '@/utils/request';
import LoginModal from '@/components/login/loginModal';
import { useModel, useLocation } from 'umi';
import { ConfigProvider } from 'antd';
import { TokenUtils } from '@/utils/token';
import Canvas from './components/canvas';

interface Props { }
const Index: React.FC<Props> = (props) => {
  const [hideNav, setHideNav] = useState(true);
  const { checkToken, resizeEvents } = useModel('global', (model) => ({
    checkToken: model.checkToken,
    resizeEvents: model.resizeEvents,
  }));
  const _location = useLocation();
  const url = _location.pathname;
  const authPage = ['/articlePage/add'];
  const resize = () => {
    if (window.innerWidth < 1400) {
      setHideNav(true);
    } else {
      setHideNav(false);
    }
  };
  const getUser = () => {
    httpGet('/user/getList').then((res) => {
      // console.log(res);
    });
  };
  useEffect(() => {
    resize();
    // window.onresize = resize;
    resizeEvents.current['layouts'] = {
      event: () => {
        resize();
      },
    };
    getUser();
    return () => {
      delete resizeEvents.current['layouts'];
    };
  }, []);
  useEffect(() => {
    checkToken();
  }, [url]);
  const app = (
    <div className={styles.contentWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.leftContainer}>
          <LeftSide />
        </div>
        <div className={styles.container}>
          {/* <div>{props.children}</div> */}
          {props.children}
        </div>
        <div
          className={styles.closeBtn}
          onClick={() => {
            setHideNav(!hideNav);
          }}
        >
          {hideNav ? <MenuOutlined /> : <RightOutlined />}
        </div>
        <div
          className={classNames(styles.rightContainer, {
            [styles.transformNav]: hideNav,
          })}
        >
          <RightSide />
        </div>
        <LoginModal />
      </div>
      <Canvas />
    </div>
  );
  const theme = TokenUtils.getTheme();
  useEffect(() => {
    document.body.setAttribute('class', `bigB-${theme || 'custom'}-theme`);
  }, [theme]);
  return app;
};
export default Index;

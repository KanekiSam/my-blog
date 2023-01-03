import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { history, useModel, useLocation } from 'umi';
import {
  BookOutlined,
  CaretUpOutlined,
  CoffeeOutlined,
  CustomerServiceOutlined,
  EditOutlined,
  HomeOutlined,
  KeyOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import SearchBtn from '@/components/SearchBtn';
import NavDrawer from '@/layouts/components/navDrawer';
import styles from './index.less';
import { useScroll } from '@umijs/hooks';
import ArticleInfo from './components/articleInfo';
import Question from '../questionBank/question';
import { httpGet } from '@/utils/request';
import { Popover, Tooltip } from 'antd';
import { TokenUtils } from '@/utils/token';
import CheckSkinDrawer from './components/checkSkin';
import HeadGuide from '@/components/HeadGuide';
import Game from '../game';

interface Props { }
const HomePage: React.FC<Props> = (props) => {
  const { isLogin, onRefresh } = useModel('global', (model) => ({
    isLogin: model.isLogin,
    onRefresh: model.onRefresh,
  }));
  const [msgCount, setMsgCount] = useState(0);
  const [showSkin, setShowSkin] = useState(false);
  const navList = [
    {
      tab: '首页',
      icon: <HomeOutlined />,
      onClick: () => {
        history.push('/');
        setActiveNav(0);
      },
    },
    {
      tab: '刷题库',
      icon: <BookOutlined />,
      onClick: () => {
        setActiveNav(1);
      },
    },
    {
      tab: '小游戏',
      icon: <CustomerServiceOutlined />,
      onClick() {
        setActiveNav(2);
      },
    },
    {
      tab: '照片墙',
      icon: <CoffeeOutlined />,
      onClick() {
        window.open('/photoWall');
      },
    },
  ];
  if (isLogin) {
    navList.push({
      tab: '写博文',
      icon: <EditOutlined />,
      onClick: () => {
        history.push('/articlePage/add');
      },
    });
  }
  const [active, setActive] = useState(-1);
  const [activeNav, setActiveNav] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [scroll] = useScroll(document.body);
  const { setShowLogin } = useModel('global', (model) => ({
    setShowLogin: model.setShowLogin,
  }));
  const handleLogin = () => {
    setShowLogin(true);
  };
  const getMessageCount = () => {
    httpGet('/message/msgCount').then(({ success, data }) => {
      if (success) {
        setMsgCount(data);
      }
    });
  };
  const toggleTheme = (themeType: 'dark' | undefined) => {
    if (TokenUtils.getTheme() === themeType) {
      return;
    }
    if (themeType === undefined) {
      TokenUtils.clearTheme();
    } else {
      TokenUtils.setToken({ bigBtheme: themeType });
    }
    onRefresh();
    setShowPop(false);
  };
  useEffect(() => {
    const current = new Date().getTime();
    if (current < new Date('').getTime()) {
    }
  }, []);
  useEffect(() => {
    if (isLogin) {
      getMessageCount();
    }
  }, [isLogin]);
  const _location: any = useLocation();
  const { query } = _location || {};
  useEffect(() => {
    if (query.nav == '0' || query.nav == '1') {
      setActiveNav(Number(query.nav));
    }
  }, [query]);
  return (
    <div className={styles.homeWrapper}>
      <div
        className={classNames(
          { [styles.fixed]: scroll.top > 20 },
          styles.headerWrapper,
        )}
      >
        <div className={classNames(styles.header)}>
          <div className={styles.img}>
            <img src={require('@/static/img/toux.jpg')} alt="" />
          </div>
          <div className={styles.author}>
            <span className={styles.name}>bigB</span>
            <span className={styles.desc}>大斌的博客网站</span>
          </div>
          <div className={styles.nav}>
            {navList.map((item, index) => (
              <div
                key={item.tab}
                className={classNames(styles.navLink, {
                  [styles.active]: activeNav === index,
                })}
                onClick={() => {
                  item.onClick?.();
                }}
              >
                {item.tab}
              </div>
            ))}
          </div>
          <SearchBtn />
          <div className={styles.rightWrapper}>
            {isLogin ? (
              <div
                className={styles.messageBox}
                onClick={() => {
                  history.push('/notice');
                }}
              >
                <img src={require('../../static/img/email.png')} />
                {msgCount ? (
                  <span className={styles.count}>{msgCount}</span>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
            <div
              className={styles.messageBox}
              id="messageBox"
              onClick={() => {
                // if (window.innerWidth <= 630) {
                //   setShowSkin(true);
                // }
              }}
            >
              {!TokenUtils.getTheme() ? (
                <img
                  src={require('../../static/img/night.png')}
                  onClick={() => {
                    toggleTheme('dark');
                  }}
                />
              ) : (
                <img
                  src={require('../../static/img/sun.png')}
                  onClick={() => toggleTheme(undefined)}
                />
              )}

              {/* <Popover
                trigger="click"
                getPopupContainer={() =>
                  document.getElementById('messageBox') || document.body
                }
                visible={showPop}
                onVisibleChange={(v) => setShowPop(v)}
                title="切换主题"
                content={
                  <div className={styles.tooltip}>
                    <div className={styles.flexWrapper}>
                      <div
                        className={classNames(styles.item, {
                          [styles.active]: !TokenUtils.getTheme(),
                        })}
                        onClick={() => {
                          toggleTheme(undefined);
                        }}
                      >
                        <img src={require('../../static/img/theme.png')} />
                        <div>白色</div>
                      </div>
                      <div
                        className={classNames(styles.item, {
                          [styles.active]: TokenUtils.getTheme() === 'dark',
                        })}
                        onClick={() => {
                          toggleTheme('dark');
                        }}
                      >
                        <img src={require('../../static/img/theme1.png')} />
                        <div>黑色</div>
                      </div>
                    </div>
                  </div>
                }
              >
                <img src={require('../../static/img/theme.png')} />
              </Popover> */}
            </div>
            {query.login === 'bigB' && !isLogin ? (
              <a className={styles.loginBtn} onClick={handleLogin}>
                <KeyOutlined className={styles.icon} />
                登录
              </a>
            ) : (
              ''
            )}
            <div className={styles.menuIcon} onClick={() => setVisible(true)}>
              <MenuOutlined />
            </div>
          </div>
        </div>
      </div>
      {activeNav === 0 && <ArticleInfo />}
      {activeNav === 1 && <Question />}
      {activeNav === 2 && <Game />}
      <NavDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        navList={navList}
        active={active}
      />
      <CheckSkinDrawer
        visible={showSkin}
        onClose={() => setShowSkin(false)}
        onRefresh={onRefresh}
      />
      {scroll.top > 20 ? <div className={styles.backTop} onClick={() => {
        document.body.scrollTo({ top: 0 });
      }}><CaretUpOutlined className={styles.icon} /></div> : ''}
      {/* <HeadGuide /> */}
    </div>
  );
};
export default HomePage;

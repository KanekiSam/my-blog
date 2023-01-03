import Provider from '@/.umi/plugin-model/Provider';
import { useModel } from '@/.umi/plugin-model/useModel';
import { Modal, Space, Tabs } from 'antd';
import React from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import styles from './index.less';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

interface Props {}
const LoginModal: React.FC<Props> = (props) => {
  const { visible, setShowLogin } = useModel('global', (model) => ({
    visible: model.showLogin,
    setShowLogin: model.setShowLogin,
  }));
  const [curTab, setCurTab] = useState('0');
  const tabs = [
    { tab: '登录', node: <LoginForm /> },
    // {
    //   tab: '注册',
    //   node: (
    //     <RegisterForm
    //       toLogin={() => {
    //         setCurTab('0');
    //       }}
    //     />
    //   ),
    // },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setShowLogin(false);
      }}
      className={styles.loginModal}
      footer={null}
    >
      <div className={styles.tip}>
        登录信息仅用于本博客平台上相关互动，相互交流学习～
      </div>
      <Tabs animated activeKey={curTab} onChange={(v) => setCurTab(v)}>
        {tabs.map((item, i) => (
          <Tabs.TabPane key={String(i)} tab={item.tab}>
            {item.node}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Modal>
  );
};
export default LoginModal;

import { useModel, history } from 'umi';
import { httpPost } from '@/utils/request';
import { TokenUtils } from '@/utils/token';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import styles from './index.less';

interface Props {}
const LoginForm: React.FC<Props> = (props) => {
  const { setShowLogin } = useModel('global', (model) => ({
    setShowLogin: model.setShowLogin,
  }));
  const [form] = Form.useForm();
  const rules = [{ required: true, message: '这里不能不填哟' }];
  const { setIsLogin } = useModel('global', (model) => ({
    setIsLogin: model.setIsLogin,
  }));
  const onLogin = () => {
    form.validateFields().then((values) => {
      httpPost('/auth/login', values).then(({ success, data }) => {
        if (success) {
          message.info('登录成功');
          history.push('/');
          window.location.reload();
          TokenUtils.setToken({
            token: data.access_token,
            userInfo: { userId: data.userId, userName: data.userName },
          });
          setShowLogin(false);
          setIsLogin(true);
        }
      });
    });
  };
  return (
    <div className={styles.loginForm}>
      <Form
        form={form}
        labelAlign="left"
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        requiredMark={false}
      >
        <Form.Item
          label={
            <div>
              <UserOutlined className={styles.icon} />
              账户名
            </div>
          }
          rules={rules}
          name="username"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={
            <div>
              <KeyOutlined className={styles.icon} />
              登录密码
            </div>
          }
          rules={rules}
          name="password"
        >
          <Input type="password" />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Button
          style={{ width: 100, marginRight: 8 }}
          onClick={() => {
            setShowLogin(false);
          }}
        >
          取消
        </Button>
        <Button
          style={{ background: '#2d2d2d', color: 'white', width: 100 }}
          onClick={onLogin}
        >
          登录
        </Button>
      </div>
    </div>
  );
};
export default LoginForm;

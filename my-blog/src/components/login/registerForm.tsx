import { useModel } from '@/.umi/plugin-model/useModel';
import { httpGet, httpPost } from '@/utils/request';
import uploadFileFunc from '@/utils/upload';
import {
  HighlightOutlined,
  KeyOutlined,
  MailOutlined,
  PlusOutlined,
  QqOutlined,
  QuestionOutlined,
  SmileOutlined,
  UserOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Upload } from 'antd';
import { useDebounceFn } from '@umijs/hooks';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useState } from 'react';
import ImgCropUpload from '../ImgCropUpload';
import styles from './index.less';

interface Props {
  toLogin: () => void;
}
const RegisterForm: React.FC<Props> = (props) => {
  const { setShowLogin } = useModel('global', (model) => ({
    setShowLogin: model.setShowLogin,
  }));
  const [fileList, setFileList] = useState<Array<UploadFile<any>>>([]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const [form] = Form.useForm();
  const { run } = useDebounceFn((value, clb) => {
    httpGet('/user/checkName', { userName: value }).then(
      ({ success, data }) => {
        if (success) {
          if (!data) {
            clb('名称已经被占用');
          } else {
            clb();
          }
        } else {
          clb('网络出现问题，请稍后重试');
        }
      },
      () => {
        clb('网络出现问题，请稍后重试');
      },
    );
  }, 500);
  const rules = [{ required: true, message: '这里不能不填哟' }];
  const onRegister = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
      const url = await uploadFileFunc(values.userAvator.file);
      if (url) {
        httpPost('/user/auth/register', {
          ...values,
          userAvator: url,
        }).then(({ success, data }) => {
          if (success) {
            message.success('注册成功');
            props.toLogin();
            form.resetFields();
          }
        });
      }
    });
  };
  return (
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
            注册账户名
          </div>
        }
        name="userName"
        rules={[
          ...rules,
          {
            validator(rule, value, clb) {
              console.log(value);
              if (!value) {
                clb('名称不能为空');
                return;
              }
              run(value, clb);
            },
          },
        ]}
      >
        <Input placeholder="名称唯一" />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <KeyOutlined className={styles.icon} />
            登录密码
          </div>
        }
        name="userPassword"
        rules={rules}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <WomanOutlined className={styles.icon} />
            性别
          </div>
        }
        name="userSex"
        rules={rules}
      >
        <Radio.Group>
          <Radio value={1}>妹子</Radio>
          <Radio value={0}>男孩</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={
          <div>
            <QqOutlined className={styles.icon} />
            QQ
          </div>
        }
        name="userQq"
        rules={rules}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <MailOutlined className={styles.icon} />
            Email
          </div>
        }
        name="userEmail"
        rules={rules}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <QuestionOutlined className={styles.icon} />
            找回密码问题设置
          </div>
        }
        name="question"
        rules={rules}
      >
        <Input maxLength={100} />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <HighlightOutlined className={styles.icon} />
            找回密码答案
          </div>
        }
        name="answer"
        rules={rules}
      >
        <Input maxLength={30} />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <SmileOutlined className={styles.icon} />
            头像上传
          </div>
        }
        name="userAvator"
        rules={rules}
      >
        <ImgCropUpload
          beforeUpload={(file) => {
            // uploadFileFunc(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (res: any) => {
              setFileList([
                {
                  uid: '1',
                  name: 'user-avator',
                  url: res.target.result,
                  status: 'done',
                },
              ]);
            };
            return false;
          }}
          fileList={fileList}
          onRemove={() => {
            setFileList([]);
          }}
        >
          {uploadButton}
        </ImgCropUpload>
      </Form.Item>
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Button
          style={{ width: 100, marginRight: 8 }}
          onClick={() => setShowLogin(false)}
        >
          取消
        </Button>
        <Button
          style={{ background: '#2d2d2d', color: 'white', width: 100 }}
          onClick={onRegister}
        >
          注册
        </Button>
      </div>
    </Form>
  );
};
export default RegisterForm;

import React from 'react';
import { Divider, Form, Input, message, Modal, Button } from 'antd';
import { history } from 'umi';
import TagType from './tagType';
import { httpPost } from '@/utils/request';
import { ImageListItem } from '../addArticle';
import ImageList from './imageList';
import { useEffect } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  getHtml: () => string | undefined | void;
  imageList: ImageListItem[];
  uploadFunc: (file: File) => void;
  title?: string;
  id?: string;
  initData?: any;
}
const ReleaseModal: React.FC<Props> = (props) => {
  const { initData, id } = props;
  const [form] = Form.useForm();
  const onSave = () => {
    form.validateFields().then((values) => {
      console.log(values);
      httpPost('/article/save', {
        content: props.getHtml?.() ?? '',
        ...values,
        imageUrls: values.imageUrls.join('|'),
        articleId: id,
      }).then(({ success }) => {
        if (success) {
          message.success('保存成功');
          history.goBack();
        }
      });
    });
  };
  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({ title: props.title });
    }
  }, [props.visible, props.title]);

  useEffect(() => {
    if (props.visible && id) {
      form.setFieldsValue({
        ...initData,
        imageUrls: initData.imageUrls ? initData.imageUrls.split('|') : [],
      });
    }
  }, [props.visible, initData, id]);
  return (
    <Modal
      title="文章发布"
      visible={props.visible}
      onCancel={props.onClose}
      onOk={onSave}
      footer={[
        <Button onClick={props.onClose}>取消</Button>,
        <Button type="primary" onClick={onSave}>
          确定
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="article-form"
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        // onFinish={(values) => console.log(values)}
      >
        <Form.Item
          label="文章标题"
          name="title"
          rules={[{ required: true, message: '文章标题不能为空' }]}
        >
          <Input maxLength={150} />
        </Form.Item>
        <Form.Item
          label="文章类型"
          name="articleTypeId"
          rules={[{ required: true, message: '文章类型不能为空' }]}
        >
          <TagType disabled={id ? true : false} />
        </Form.Item>
        <Form.Item
          label="文章描述"
          name="articleDesc"
          rules={[{ required: true, message: '文章描述不能为空' }]}
        >
          <Input.TextArea
            maxLength={200}
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="200字以内"
          />
        </Form.Item>
        <Form.Item
          label="文章搜索关键字"
          name="keyword"
          rules={[{ required: true, message: '文章搜索关键字不能为空' }]}
        >
          <Input.TextArea
            maxLength={150}
            placeholder="关键字内容，英文逗号隔开"
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        </Form.Item>
        <Form.Item
          label="文章详情图片"
          name="imageUrls"
          rules={[{ required: true, message: '文章详情图片不能为空' }]}
        >
          <ImageList dataList={props.imageList} uploadFunc={props.uploadFunc} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ReleaseModal;

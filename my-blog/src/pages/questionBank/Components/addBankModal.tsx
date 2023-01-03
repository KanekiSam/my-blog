import ImgCropUpload from '@/components/ImgCropUpload';
import { httpPost } from '@/utils/request';
import uploadFileFunc from '@/utils/upload';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useState } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
}
const AddBankModal: React.FC<Props> = (props) => {
  const [fileList, setFileList] = useState<Array<UploadFile<any>>>([]);
  const [file, setFile] = useState<File>();
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      if (!file) {
        return;
      }
      const url = await uploadFileFunc(file);
      httpPost('/auth/questionBank/addCategory', {
        ...values,
        posterUrl: url,
      }).then(({ success }) => {
        if (success) {
          // Modal.info({
          //   title: '提交成功',
          //   content: '感谢你的支持，你的创建作者已经收到，等待作者通过审核',
          // });
          props.onClose();
          props.reload();
        }
      });
    });
  };
  return (
    <Modal
      title="新建题库"
      visible={props.visible}
      onCancel={props.onClose}
      onOk={() => {
        onSubmit();
      }}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>
        <Form.Item
          label="题库名称"
          name="categoryName"
          rules={[{ required: true }]}
        >
          <Input maxLength={100} placeholder="100字内" />
        </Form.Item>
        <Form.Item
          label="封面图片"
          name="posterUrl"
          rules={[{ required: true }]}
        >
          <ImgCropUpload
            aspectCrop={3 / 2}
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              setFile(file);
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
              setFile(undefined);
            }}
          >
            {uploadButton}
          </ImgCropUpload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddBankModal;

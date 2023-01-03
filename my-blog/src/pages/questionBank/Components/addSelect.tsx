import uploadFileFunc from '@/utils/upload';
import { EditOutlined } from '@ant-design/icons';
import { useRef } from '@umijs/renderer-react/node_modules/@types/react';
import { Button, Modal } from 'antd';
import { Toast } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import Editor from 'wangeditor';
import styles from '../question.less';

interface Props {
  value?: string;
  onChange?: (v: string) => void;
}
const AddSelect: React.FC<Props> = (props) => {
  const { value, onChange } = props;
  const [visible, setVisible] = useState(false);
  const [editor, setEditor] = useState<Editor>();
  const uploadFile = (file: File) => {
    Toast.loading('图片上传中...');
    return uploadFileFunc(file).then((url) => {});
  };
  useEffect(() => {
    if (visible) {
      const _editor = new Editor('#editContent');
      _editor.config.height = 300;
      _editor.config.zIndex = 500;

      _editor.config.customUploadImg = (resultFiles, insertImgFn) => {
        console.log(resultFiles[0]);
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const file = resultFiles[0];
        uploadFile(file).then((url) => {
          insertImgFn(url);
        });
      };
      _editor.create();
      setEditor(_editor);
    } else {
      editor && editor.destroy();
      setEditor(undefined);
    }
  }, [visible]);
  useEffect(() => {
    if (visible && value) {
      if (editor) {
        editor.txt.html(value);
      }
    }
  }, [visible, value, editor]);
  return (
    <div className={styles.addSelect}>
      {!value ? (
        <Button onClick={() => setVisible(true)}>填写答案</Button>
      ) : (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: value }}
            className={styles.selectWrapper}
          ></div>
          <EditOutlined
            className={styles.editIcon}
            onClick={() => setVisible(true)}
          />
        </>
      )}
      <Modal
        title="填写答案"
        width={500}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          const str = editor ? editor.txt.html() : '';
          if (str) {
            onChange?.(str);
          }
          setVisible(false);
        }}
      >
        <div id="editContent"></div>
      </Modal>
    </div>
  );
};
export default AddSelect;

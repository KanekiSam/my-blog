import React, { useState } from 'react';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import { Modal, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';

interface Props extends UploadProps, ImgCropProps {
  aspectCrop?: number;
  shape?: 'rect' | 'round';
  value?: string;
  max?: number;
}
const ImgCropUpload: React.FC<Props> = (props) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [showPreview, setShowPreview] = useState(false);
  const { max = 1 } = props;
  const num = props.fileList?.length ?? 0;
  return (
    <>
      <ImgCrop
        modalTitle="图片剪切"
        modalOk="确定"
        modalCancel="取消"
        aspect={props.aspectCrop}
        shape={props.shape}
        onModalOk={()=>{

        }}
      >
        <Upload
          listType="picture-card"
          {...props}
          onPreview={(file) => {
            if (file.url) {
              setPreviewUrl(file.url);
              setShowPreview(true);
            }
          }}
        >
          {num >= max ? null : props.children}
        </Upload>
      </ImgCrop>
      <Modal
        footer={null}
        visible={showPreview}
        onCancel={() => setShowPreview(false)}
      >
        <img style={{ width: '100%' }} src={previewUrl} />
      </Modal>
    </>
  );
};
export default ImgCropUpload;

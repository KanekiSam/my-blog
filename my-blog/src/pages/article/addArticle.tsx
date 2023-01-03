import React, { useState, useEffect } from 'react';
import Editor from 'wangeditor';
import xss from 'xss';
import { history, useLocation, utils } from 'umi';
import styles from './addArticle.less';
import ReleaseModal from './components/releaseModal';
import { Input, message, Modal, Button } from 'antd';
import { Toast } from 'antd-mobile';
import _ from 'lodash';
import { useRef } from 'react';
import uploadFileFunc from '@/utils/upload';
import { httpGet, httpPost } from '@/utils/request';

export interface ImageListItem {
  name: string;
  url: string;
}
interface Props {}
const AddArticle: React.FC<Props> = (props) => {
  const [editor, setEditor] = useState<Editor>();
  const [visible, setVisible] = useState(false);
  const imageList = useRef<{ urls: ImageListItem[] }>({ urls: [] });
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState<any>();
  const [refresh, setRefresh] = useState(false);
  const uploadFile = (file: File) => {
    Toast.loading('图片上传中...');
    return new Promise((r, j) => {
      uploadFileFunc(file).then(
        (url) => {
          // const url = client.signatureUrl(res.url);
          // console.log(url);
          // 上传图片，返回结果，将图片插入到编辑器中
          const _imageList = _.cloneDeep(imageList.current.urls);
          const index = _imageList.findIndex((item) => item.name === file.name);
          if (index === -1) {
            _imageList.push({ url, name: file.name });
          } else {
            _imageList[index].url = url;
          }
          imageList.current.urls = _imageList;
          setRefresh(!refresh);
          r(url);
        },
        () => {
          j();
        },
      );
    });
  };
  useEffect(() => {
    const _editor = new Editor('#editContent');
    _editor.config.height = 500;
    _editor.config.zIndex = 500;

    _editor.config.customUploadImg = (resultFiles, insertImgFn) => {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      const file = resultFiles[0];
      uploadFile(file).then((url) => {
        insertImgFn(url);
      });
    };
    _editor.create();
    setEditor(_editor);
    return () => {
      _editor.destroy();
      setEditor(undefined);
    };
  }, []);
  const getSafeHtml = () => {
    if (editor) {
      const html = editor.txt.html();
      if (html) {
        const safeHtml = xss(html);
        return safeHtml;
      }
    }
    return '';
  };
  const submit = () => {
    const html = getSafeHtml();
    if (!html) {
      message.warning('文章内容不能为空');
    } else {
      setVisible(true);
      return;
      if (query.id) {
        Modal.confirm({
          title: '提示',
          content: '是否确认修改',
          onOk: () => {
            return new Promise((r, j) => {
              httpPost('/article/save', {
                content: html,
                articleId: query.id,
              }).then(({ success }) => {
                if (success) {
                  message.success('保存成功');
                  history.goBack();
                  r(true);
                } else {
                  j();
                }
              }, j);
            });
          },
        });
      } else {
        setVisible(true);
      }
    }
  };
  const _location: any = useLocation();
  const { query = {} } = _location;
  useEffect(() => {
    if (query.id && editor) {
      httpGet('/article/getById', { id: query.id }).then(
        ({ success, data }) => {
          if (success && typeof data === 'object') {
            editor.txt.html(xss(data.content));
            setTitle(data.title);
            setDetail(data);
            const urls = data.imageUrls ? data.imageUrls.split('|') : [];
            imageList.current.urls = urls.map((item) => {
              const name = item.slice(item.lastIndexOf('/') + 1, -1);
              return { url: item, name };
            });
            setRefresh(!refresh);
          }
        },
      );
    }
  }, [query.id, editor]);
  return (
    <div className={styles.wangeditor}>
      <Input.TextArea
        className={styles.title}
        prefix="文章标题："
        placeholder="文章标题,150字内"
        maxLength={150}
        autoSize={{ maxRows: 3, minRows: 3 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div id="editContent"></div>
      <div className={styles.footer}>
        <Button
          onClick={() => {
            history.goBack();
          }}
          style={{ marginRight: 10 }}
        >
          取消
        </Button>
        <Button
          style={{ backgroundColor: '#666', color: 'white' }}
          onClick={() => submit()}
        >
          发表文章
        </Button>
      </div>
      <ReleaseModal
        id={query.id}
        initData={detail}
        visible={visible}
        onClose={() => setVisible(false)}
        getHtml={() => getSafeHtml()}
        imageList={imageList.current.urls}
        uploadFunc={uploadFile}
        title={title}
      />
    </div>
  );
};
export default AddArticle;

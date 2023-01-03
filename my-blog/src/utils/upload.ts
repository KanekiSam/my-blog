import OSS from 'ali-oss';
import { Toast } from 'antd-mobile';
// 具体值需要去阿里云控制台获取
let client = new OSS({
  // // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'oss-cn-beijing',
  // // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: 'LTAI5tRUn5tjNbsN5KunZcbg',
  accessKeySecret: 'RKxIvQfcG4lv1sJLpWLkZhcG5exuZK',
  bucket: 'bigbblog',
  secure: true,
});

const uploadFileFunc = (file: File, path?: string) => {
  Toast.loading('图片上传中...');
  const index = file.name.lastIndexOf('.');
  const type = file.name.slice(index);
  const name = file.name.slice(0, index).replace(/\//g, '');
  const fileName = `${name}-${new Date().getTime()}${type}`;
  return new Promise<any>((r, j) => {
    client
      .put(`${path || '/myblog'}/${fileName}`, file)
      .then((res) => {
        Toast.hide();
        r(res.url);
      })
      .catch(function (err) {
        Toast.hide();
        j(err);
      });
  });
};
export default uploadFileFunc;

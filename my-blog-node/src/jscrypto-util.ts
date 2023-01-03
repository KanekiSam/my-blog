/**
 * crypto-js插件封装
 */
var CryptoJS = require('crypto-js');
/**
 * 密钥 这里可以让接口返回
 */
const secretKey = 'hjfhsjjhfshfbbbajsjaaaadd';

// export default {

/**
 * 加密
 */
function encrypt(content: string): string {
  return CryptoJS.AES.encrypt(content, secretKey).toString();
}

/**
 * 解密
 */
function decrypt(aesPassWord: string): string {
  var bytes = CryptoJS.AES.decrypt(aesPassWord, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export default {
  encrypt,
  decrypt,
};

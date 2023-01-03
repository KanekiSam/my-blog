/**
 * crypto-js插件封装
 */
import CryptoJS from 'crypto-js';
import { Config } from './config';

/**
 * 加密
 */
function encrypt(content: any): string {
  return CryptoJS.AES.encrypt(content, Config.questionkey).toString();
}

/**
 * 解密
 */
function decrypt(aesPassWord: any): string {
  var bytes = CryptoJS.AES.decrypt(aesPassWord, Config.questionkey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export default {
  encrypt,
  decrypt,
};

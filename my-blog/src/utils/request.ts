import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Modal, message } from 'antd';
import { Toast } from 'antd-mobile';
import jscrypto from './jscrypto-util';
import { TokenUtils } from './token';
// message.config({ duration: 2000 });
interface RequestConfig extends AxiosRequestConfig {
  noLoading?: boolean;
  loadingCount?: number;
  noErrorTip?: boolean;
}
interface ResponseData {
  resultCode: string;
  resultObject: any;
  [propName: string]: any;
}
interface BaseResponse<T = any> extends AxiosResponse<T> {
  total?: number;
  headers: {
    totalCount?: number;
    [propName: string]: any;
  };
  success?: boolean;
  message?: string;
  code?: string;
  statusCode?: number;
}
axios.defaults.timeout = 1000 * 30 * 60;

let loadingCount = 1; // 并发请求数量，用于多个请求都请求结束后关闭loading
let needLoading = true;
const ASE_FLAG = true;
const SHOWLOG = true;
axios.interceptors.request.use(
  (req: RequestConfig) => {
    // 无需加载动画
    needLoading = !req.noLoading;
    if (!req.noLoading) {
      Toast.loading('加载中...', 0);
    }
    if (req.loadingCount) {
      const { loadingCount: count } = req;
      loadingCount = count;
    }
    const { token } = TokenUtils.getToken();
    req.headers.Authorization = token;
    delete req.noLoading;
    /**
     * 加密数据
     */
    if (ASE_FLAG) {
      if (req.data) {
        if (SHOWLOG) {
          console.log(`${req.url || ''}请求数据data：`, req.data);
        }
        req.data = { body: jscrypto.encrypt(JSON.stringify(req.data)) };
      }
    }
    return req;
  },
  (error) => {
    Toast.hide();
    loadingCount = 1;
    return Promise.resolve(error);
  },
);
axios.interceptors.response.use(
  (response) => {
    if (needLoading) {
      if (loadingCount > 1) {
        loadingCount -= 1;
      } else {
        Toast.hide();
      }
    }
    /**
     * 解密数据
     */
    if (ASE_FLAG) {
      if (response.data) {
        const { data } = response.data;
        if (typeof data === 'string' || typeof data === 'number') {
          const result = jscrypto.decrypt(data); // 解密
          response.data.data = result ? JSON.parse(result) : null;
          if (SHOWLOG) {
            console.log('返回数据：', response.data.data);
          }
        }
      }
    }
    return response;
  },
  (error) => {
    Toast.hide();
    loadingCount = 1;
    if (axios.isCancel(error)) {
      const response = {
        config: {},
        headers: {},
        status: -999,
        statusText: '中断请求',
        data: undefined,
      };
      return Promise.resolve(response);
    }
    return Promise.resolve(error.response);
  },
);
function checkStatus(response: BaseResponse) {
  const { data, status } = response || {};
  return {
    ...response,
    success: status ? String(status)[0] === '2' : false,
    data: data?.data,
    message: data?.message,
    code: data?.status,
  };
}
function getErrorMessage(statusCode: number | string): string | undefined {
  const statusMsgMap: any = {
    400: 'Bad Request/错误请求!',
    401: 'Unauthorized/未授权!',
    403: 'Forbidden/禁止!',
    404: 'Not Found/未找到资源!',
    405: 'Method Not Allowed/方法未允许!',
    406: 'Not Acceptable/无法访问!',
    407: 'Proxy Authentication Required/代理服务器认证要求!',
    408: 'Request Timeout/请求超时!',
    409: 'Conflict/冲突!',
    410: 'Gone/已经不存在!',
    417: 'Expectation Failed/请求头信息期望失败!',
    500: 'Internal Server Error/内部服务器错误!',
    501: 'Not Implemented/未实现!',
    502: 'Bad Gateway/错误的网关!`',
    503: 'Service Unavailable/服务无法获得!',
    504: 'Gateway Timeout/网关超时!',
    505: 'HTTP Version Not Supported/不支持的 HTTP 版本!',
  };
  return statusMsgMap[statusCode];
}
export function errorProcess(
  req: RequestConfig,
  response: BaseResponse,
): Promise<BaseResponse<T>> {
  const { success, message: msg, status } = response;
  if (!req.noErrorTip) {
    if (!success) {
      if (msg) {
        message.info(msg);
      } else if (getErrorMessage(status)) {
        message.info(getErrorMessage(status));
      }
    }
  }
  //   const { code, success, message: msg } = response;
  //   if (!success) {
  //     if (msg) {
  //       let text = msg;
  //       if (text?.length > 80) {
  //         text = `${text.slice(0, 80)}...`;
  //       }
  //       message.info(text);
  //       return response;
  //     }
  //     if (code) {
  //       const errorMsg = getErrorMessage(code);
  //       if (errorMsg) {
  //         message.info(errorMsg);
  //       }
  //     }
  //   }
  return response;
}
export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
export interface RequestParams {
  method?: Method;
  url: string;
  payload?: any;
  headers?: any;
}
export default function request(
  options: RequestConfig,
): Promise<BaseResponse<T>> {
  return axios(options).then(checkStatus);
}

export function httpRequest<T>(req: RequestParams): Promise<BaseResponse<T>> {
  const options = req;
  return request({
    ...options,
    [req.method === Method.GET ? 'params' : 'data']: req.payload,
  }).then((res) => errorProcess(req, res));
}
export function httpGet<T = any>(
  url: string,
  data?: any,
  options?: any,
): Promise<BaseResponse<T>> {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.GET,
    ...options,
  });
}
export function httpPost<T = ResponseData>(
  url: string,
  data?: any,
  options?: any,
): Promise<BaseResponse<T>> {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.POST,
    ...options,
  });
}
export function httpPut<T = any>(
  url: string,
  data?: any,
  options?: any,
): Promise<BaseResponse<T>> {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.PUT,
    ...options,
  });
}
export function httpDelete<T = any>(
  url: string,
  data?: any,
  options?: any,
): Promise<BaseResponse<T>> {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.DELETE,
    ...options,
  });
}

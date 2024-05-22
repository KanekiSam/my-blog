import Cookies from 'js-cookie';

const bigBTkey = 'access-token'.toLocaleUpperCase();
const bigBUser = 'bigbUser'.toLocaleUpperCase();
const bigBtheme = 'bigBtheme'.toLocaleUpperCase();

interface UserInfo {
  userId?: string;
  userName?: string;
}

const setToken = (obj: {
  token?: string;
  userInfo?: UserInfo;
  bigBtheme?: string;
}): void => {
  const { token, userInfo, bigBtheme: theme } = obj;
  /** 失效时间30分钟 */
  const millisecond = new Date().getTime();
  const expires = new Date(millisecond + 60 * 1000 * 12 * 60);
  if (token) {
    Cookies.set(bigBTkey, token, { expires });
  }
  if (userInfo) {
    Cookies.set(bigBUser, JSON.stringify(userInfo), { expires });
  }
  if (theme) {
    Cookies.set(bigBtheme, theme, { expires });
  }
};

const getToken = (): { token: string; userInfo: UserInfo } => {
  let userInfo = Cookies.get(bigBUser);
  userInfo = userInfo ? JSON.parse(userInfo) : {};
  return { token: Cookies.get(bigBTkey), userInfo };
};

const clearToken = (): void => {
  Cookies.remove(bigBTkey);
  Cookies.remove(bigBUser);
};
const getTheme = () => {
  return Cookies.get(bigBtheme);
};
const clearTheme = () => {
  Cookies.remove(bigBtheme);
};

export const TokenUtils = {
  setToken,
  getToken,
  clearToken,
  getTheme,
  clearTheme,
};

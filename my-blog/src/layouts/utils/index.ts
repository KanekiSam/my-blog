import { TokenUtils } from '@/utils/token';

export const initTheme = () => {
  const nowTime = new Date().getTime();
  const timePoint = new Date().setHours(18, 0, 0);
  let theme;
  if (nowTime > timePoint) {
    theme = 'dark';
  } else {
    theme = 'custom';
  }
  TokenUtils.setToken({ bigBtheme: theme });
  document.body.setAttribute('class', `bigB-${theme}-theme`);
};

import { defineConfig } from 'umi';
import themeConfig from './theme.config';

// const target = 'http://10.128.9.69:3000';
const target = 'http://10.128.10.57:3000';
// const target = 'http://192.168.0.9:3000'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/search',
      component: '@/pages/search',
    },
    {
      path: '/question',
      component: '@/layouts/empty',
      routes: [{ path: '/question/bank', component: '@/pages/questionBank' }],
    },
    { path: '/photoWall', component: '@/pages/photoWall/index' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/home/index' },
        {
          path: '/articlePage',
          component: '@/pages/article',
        },
        {
          path: '/articlePage/add',
          component: '@/pages/article/addArticle',
        },
        {
          path: '/question',
          component: '@/pages/questionBank/question',
        },
        { path: '/notice', component: '@/pages/notice/index' },
      ],
    },
  ],
  proxy: {
    '/user/': {
      target,
    },
    '/article/': {
      target,
    },
    '/comment/': {
      target,
    },
    '/hotSearch/': {
      target,
    },
    '/auth/': {
      target,
    },
    '/message/': {
      target,
    },
  },
  publicPath: './',
  outputPath:'../docs'
});

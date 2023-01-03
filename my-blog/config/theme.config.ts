export default {
  theme: [
    {
      theme: 'dark',
      fileName: 'dark.css',
    },
    {
      fileName: 'mingQing.css',
      modifyVars: {
        '@primary-color': '#13C2C2',
      },
    },
  ],
  // 是否压缩css
  min: true,
  // css module
  isModule: true,
  // 忽略 antd 的依赖
  ignoreAntd: false,
  // 忽略 pro-layout
  ignoreProLayout: false,
  // 不使用缓存
  cache: true,
};

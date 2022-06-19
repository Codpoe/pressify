import { defineConfig } from 'pressify';
import type { ThemeConfig } from 'pressify/theme';

export default defineConfig<ThemeConfig>({
  pages: 'src',
  themeConfig: {
    locale: 'zh-CN',
    localeText: '中文',
    title: 'Pressify',
    description: 'A Pressify App',
    banner: 'This is early WIP!',
    docsRepo: 'codpoe/pressify',
    editLink: true,
    algolia: {
      apiKey: 'x',
      appId: 'x',
      indexName: 'x',
    },
    themeConfigByPaths: {
      '/zh': {
        locale: 'zh',
        localeText: '中文',
        nav: [
          {
            text: '文档',
            link: '/zh/guide',
          },
          {
            icon: 'uiw/github',
            link: 'https://github.com/codpoe/pressify',
          },
        ],
        sidebar: [
          {
            icon: 'twemoji:information',
            text: '项目介绍',
            link: '/zh/guide',
          },
          {
            icon: 'twemoji:rocket',
            text: '快速上手',
            link: '/zh/guide/getting-started',
          },
          {
            icon: 'twemoji:gear',
            text: '配置',
            link: '/zh/guide/config',
          },
          {
            icon: 'twemoji:world-map',
            text: '路由规则',
            link: '/zh/guide/routes',
          },
          {
            icon: 'twemoji:womans-clothes',
            text: '默认主题',
            link: '/zh/guide/default-theme',
          },
          {
            icon: 'twemoji:rainbow',
            text: '自定义主题',
            link: '/zh/guide/custom-theme',
          },
          {
            icon: 'twemoji:collision',
            text: '使用 Demo 组件进行演示',
            link: '/zh/guide/demo',
          },
        ],
      },
    },
  },
});

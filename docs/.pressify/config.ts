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
    // TODO
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
            text: 'Pressify 是什么',
            link: '/zh/guide',
          },
          {
            icon: 'twemoji:rocket',
            text: '快速上手',
            link: '/zh/guide/getting-started',
          },
          {
            text: '配置',
            link: '/zh/guide/config',
          },
          {
            text: '页面与路由',
            link: '/zh/guide/routes',
          },
          {
            text: '书写 MDX',
            link: '/zh/guide/write-mdx',
          },
          {
            text: '写组件 demo',
            link: '/zh/guide/demo',
          },
          {
            text: '部署',
            link: '/zh/guide/deploy',
          },
          {
            text: '默认主题',
            link: '/zh/guide/default-theme',
          },
          {
            text: '自定义主题',
            link: '/zh/guide/custom-theme',
          },
          {
            text: 'client API',
            link: '/zh/guide/client-api',
          },
        ],
      },
    },
  },
});

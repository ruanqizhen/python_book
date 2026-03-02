// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes as prismThemes } from 'prism-react-renderer';
import math from 'remark-math';
import katex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Python 秘籍',
  tagline: '面向读者的 Python 编程实战指南：涵盖基础、进阶、数据分析与面试干货',
  url: 'https://py.qizhen.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  projectName: 'python_book', // Usually your repo name.
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          sidebarCollapsed: false,
          // Please change this to your repo.
          editUrl: 'https://github.com/ruanqizhen/python_book/edit/main/',
          routeBasePath: '/',
          path: './docs',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-9EFRGQK2N0',
        },
      }),
    ],
  ],

  themeConfig: (
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: 'img/logo.png',
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: true,
        title: 'Python 秘籍',
        logo: {
          alt: 'Python',
          src: 'img/logo.png',
          href: '/'
        },
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      zoomSelector: '.markdown img',
      metadata: [
        { name: 'keywords', content: 'Python, 编程, 经验, 教程, 开源, 免费, 电子书, 下载, PDF, 示例, 面试, 数据分析, 机器学习' },
        { name: 'description', content: '《Python 秘籍》是一本开源的 Python 学习指南，包含丰富的代码示例、进阶技巧和面试准备内容。' },
        { name: 'author', content: 'Qizhen Ruan 阮奇桢' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'og:title', content: 'Python 秘籍 - 你的 Python 编程进阶宝典' },
        { name: 'og:description', content: '开源、免费的 Python 电子书，涵盖从基础到实战的方方面面。' },
      ],
    }
  ),
  plugins: [
    function analyticsPlugin(context, options) {
      return {
        name: 'analytics-plugin',
        injectHtmlTags({ content }) {
          return {
            postBodyTags: [`
               <script async type="text/javascript" src="https://hm.baidu.com/hm.js?b3f6e7ec9302021671173e3fad14f4cd"></script>
               <script async type="text/javascript">
                 (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "jxmn1qjx88");
               </script>
            `],
          };
        },
      };
    },
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "zh"],
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    "./src/plugin/plugin-image-zoom",
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;


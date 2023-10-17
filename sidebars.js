// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Python 教程',
      link: {
        type: 'doc',
        id: 'README',
      },
      items: [ 
        'ide', 
		{
          type: 'link',
          label: '作者个人主页',
          href: 'https://qizhen.xyz',
        },
      ],
    },
  ],

};

module.exports = sidebars;

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
		'hello_world',
		'variable',
		'calculation',
		'string',
		'list',
		'condition',
		'loop',
		'dict',
		'function',
		'recursive',
		'module',
		'exception',
		'file_io',
		'debug',
		'functional',
		'generator',
		'high_order',
		'decorator',
		'oop',
		'magic_methods',
		'multiple_inheritance',
		'oop2',
		'design_method',
		'solid',
		'asyncio',
		'multithread',
		'multiprocess',
		'algorithm',
		'array',
		'placeholder',
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

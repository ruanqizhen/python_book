// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      label: '前言',
      id: 'README',
    },
    {
      type: 'category',
      label: '编程基础',
      link: {
        type: 'doc',
        id: 'basic',
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
      ],
    },
    {
      type: 'category',
      label: '函数式编程',
      link: {
        type: 'doc',
        id: 'functional',
      },
      items: [ 
		'generator',
		'high_order',
		'decorator',
      ],
    },
    {
      type: 'category',
      label: '面向对象编程',
      link: {
        type: 'doc',
        id: 'oop',
      },
      items: [ 
		'magic_methods',
		'multiple_inheritance',
		'oop2',
		'design_method',
		'solid',
      ],
    },
    {
      type: 'category',
      label: '数据结构与算法',
      link: {
        type: 'doc',
        id: 'algorithm',
      },
      items: [ 
		'asyncio',
		'multithread',
		'multiprocess',
		'algorithm',
		'array',
		'linked_list',
		'placeholder',
        {
          type: 'link',
          label: 'GitHub 项目',
          href: 'https://github.com/ruanqizhen/py_book',
        },
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

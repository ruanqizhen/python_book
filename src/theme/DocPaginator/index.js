import React from 'react';
import DocPaginator from '@theme-original/DocPaginator';
import Giscus from '@giscus/react';

export default function DocPaginatorWrapper(props) {
  return (
    <>
      <DocPaginator {...props} />
	  <br />
	  <Giscus
		repo='ruanqizhen/python_book'
		repoId='R_kgDOKhrU6g'
		category='Announcements'
		categoryId='DIC_kwDOGYjRCc4B_4dq'
		mapping='pathname'
		strict='1'
		reactionsEnabled='1'
		emitMetadata='1'
		inputPosition='top'
		theme='preferred_color_scheme'
		lang='zh-CN'
	  />
    </>
  );
}

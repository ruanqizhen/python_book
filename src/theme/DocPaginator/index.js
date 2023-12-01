import React from 'react';
import DocPaginator from '@theme-original/DocPaginator';
import Giscus from '@giscus/react';

export default function DocPaginatorWrapper(props) {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme == '') theme = 'light';
  return (
    <>
      <DocPaginator {...props} />
	  <br />
	  <Giscus
		repo='ruanqizhen/python_book'
		repoId='R_kgDOKhrU6g'
		category='Announcements'
		categoryId='DIC_kwDOKhrU6s4CaOFt'
		mapping='pathname'
		strict='1'
		reactionsEnabled='1'
		emitMetadata='1'
		inputPosition='top'
		theme={theme}
		lang='zh-CN'
        loading="lazy"
	  />
    </>
  );
}

import html from 'remark-html';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import remarkHeadings from '@vcarl/remark-headings';
import remarkHeaderId from 'remark-heading-id';

export default async function markdownToHtml(markdown: string) {
  const vfile = await unified()
    .use(remarkParse, { clobberPrefix: '' })
    .use(remarkStringify)
    .use(remarkHeaderId, { defaults: true })
    .use(remarkHeadings)
    .use(html)
    .process(markdown);
  return { headings: vfile.data.headings, htmlString: vfile.value } as {
    headings: Array<{ depth: number; value: string; data: { id: string } }>;
    htmlString: string;
  };
}

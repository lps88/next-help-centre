import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
// based on https://github.com/kazushisan/rehype-mdx-headings
//@ts-ignore
export const headings = (root) => {
  //@ts-ignore
  const headingList = [];
  visit(root, 'heading', (node) => {
    const heading = {
      depth: node.depth,
      value: toString(node, { includeImageAlt: false }),
    };
    // Other remark plugins can store arbitrary data
    // inside a node's `data` property, such as a
    // custom heading id.
    const data = node?.data;
    if (data) {
      //@ts-ignore
      heading.data = data;
    }
    headingList.push(heading);
  });
  //@ts-ignore
  return headingList;
};

const test = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tagName) => ({
  type: 'element',
  tagName,
}));

export default function rehypeHeadings() {
  //@ts-ignore
  return (ast, file) => {
    const headings: Array<{ depth: number; value: string; data: { id: string } }> = [];
    visit(ast, test, (node) => {
      const value = toString(node);
      const depth = parseInt(node.tagName.slice(1, 2), 10);
      if (!value || isNaN(depth)) {
        return;
      }
      headings.push({ value, depth, ...node.properties });
    });
    file.data.headings = headings;
  };
}

import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const postsDirectory = (directory: string) => join(process.cwd(), directory);

export function getArticles(directory: string) {
  return fs.readdirSync(directory);
}

export function getArticleContent(dir: string, article: string) {
  const realArticle = article.replace(/\.md$/, '');
  const fullPath = join(postsDirectory(dir), `${realArticle}.md`);

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { ...data, slug: realArticle, content } as Article;
}

export function getAllArticles(directory: string): Article[] {
  const slugs = getArticles(postsDirectory(directory));
  const posts = slugs
    .map((slug) => getArticleContent(directory, slug))
    .sort((post1, post2) => (post1.position > post2.position ? -1 : 1));
  return posts;
}

type Article = {
  title: string;
  subtitle: string;
  pageName: string;
  type: 'article' | 'hub';
  hub: string;
  position: number;
  layout: string;
  content: string;
  slug: string;
  name: string;
};

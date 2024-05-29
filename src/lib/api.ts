import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const srcDirectory = join(process.cwd(), '/src');

export function getFilesFrom(directory: string) {
  return fs.readdirSync(directory).filter((fileName) => fileName && fileName.endsWith('.md'));
}

export function getAllFiles() {
  const directories = fs.readdirSync(srcDirectory);
  return directories
    .map((d) => fs.readdirSync(srcDirectory + '/' + d).map((file) => d + '/' + file))
    .flat(1)
    .filter((fileName) => fileName && fileName.endsWith('.md'));
}

export function getContent(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(srcDirectory, `${realSlug}.md`);

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Document;
}

export function getAllArticles(): Document[] {
  const documents = getAllFiles();
  const articles = documents
    .map((slug) => getContent(slug))
    .sort((a1, a2) => (a1.position > a2.position ? -1 : 1));
  return articles;
}

export function getAllHubs(): Document[] {
  const documents = getAllFiles();
  const hubs = documents
    .map((slug) => getContent(slug))
    .filter((doc) => doc.type === 'hub')
    .sort((hub1, hub2) => (hub1.position > hub2.position ? -1 : 1));
  return hubs;
}

type Document = {
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

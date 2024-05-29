import { notFound } from 'next/navigation';
import markdownToHtml from '@/lib/markdownToHtml';
import { getAllArticles, getArticleContent } from '@/lib/api';
import ArticleNavList from './nav-list';

const level = 2;

export default async function Article({ params }: Params) {
  const post = getArticleContent('src/manage', params.article);

  if (!post) {
    return notFound();
  }

  const { htmlString: content, headings } = await markdownToHtml(post.content || '');

  return (
    <div className="nhsuk-width-container">
      {/* {% include "header.njk" %} */}
      <main className="nhsuk-main-wrapper " id="maincontent" role="main">
        <div className="nhsuk-width-container">
          {/* {% include "breadcrumbs.njk" %} */}
          <div className="nhsuk-grid-row">
            <div className="nhsuk-grid-column-one-third sticky-nav">
              <div className="article-section-nav-wrapper">
                <div className="article-section-nav">
                  <h2 className="article-section-nav__title">{post.title}</h2>
                  <ArticleNavList
                    headers={headings
                      .filter(({ depth }) => depth <= level)
                      .map(({ id, value }) => ({ id, title: value }))}
                  ></ArticleNavList>
                </div>
              </div>
            </div>
            <div
              className="nhsuk-grid-column-two-thirds article-content"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>
        </div>
      </main>
      {/* <script type="text/javascript">
          window.level = {{ level }}
      </script> */}
      {/* // {% include "footer.njk" %} */}
    </div>
  );
}

type Params = {
  params: {
    article: string;
  };
};

export function generateMetadata({ params }: Params) {
  const post = getArticleContent('src/manage', params.article);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title || 'NHS login Help centre',
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles('src/manage');
  return articles.map((post) => ({
    article: post.slug,
  }));
}

import 'nhsuk-frontend/dist/nhsuk.css';
import { notFound } from 'next/navigation';
import markdownToHtml from '@/lib/markdownToHtml';
import { getAllArticles, getArticleContent } from '@/lib/api';

export default async function Article({ params }: Params) {
  const post = getArticleContent('src/manage', params.article);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || '');

  return (
    <div>
      {/* {% include "header.njk" %} */}
      <div className="nhsuk-width-container ">
        <main className="nhsuk-main-wrapper " id="maincontent" role="main">
          <div className="nhsuk-width-container">
            {/* {% include "breadcrumbs.njk" %} */}
            <div className="nhsuk-grid-row">
              <div className="nhsuk-grid-column-one-third sticky-nav">
                <div className="article-section-nav-wrapper">
                  <div className="article-section-nav">
                    <h2 className="article-section-nav__title">{post.title}</h2>
                    <nav>
                      <ol className="article-section-nav__list">
                        {/* {%- for heading in collections.articles[page.url].headings-%}
                                              {%- if heading.level <= level -%}
                                                  <li>
                                                      <a href="#{{ heading.fragment }}" aria-label="Scroll to '{{heading.title}}'" title="Scroll to '{{heading.title}}'">
                                                          {{ heading.title }}
                                                      </a>
                                                  </li>
                                              {%- endif -%}
                                          {%- endfor -%} */}
                      </ol>
                    </nav>
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
      </div>
      {/* <script type="text/javascript">
          window.level = {{ level }}
      </script> */}
      {/* <script src={{ "/js/header-marker.js" | url }}></script> */}
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

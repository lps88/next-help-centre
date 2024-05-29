import { notFound } from 'next/navigation';
import { getAllArticles, getAllHubs, getContent } from '@/lib/api';

export default async function Hub({ params }: Params) {
  const articles = getAllArticles().filter((a) => a.hub === params.hub || a.name === params.hub);

  const hub = articles.find((a) => a.type === 'hub' && a.name === params.hub);
  if (!hub) {
    return notFound();
  }
  return (
    <div className="nhsuk-width-container">
      {/* {% include "header.njk" %} */}
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper" id="maincontent" role="main">
          <div className="nhsuk-grid-row">
            <div className="nhsuk-grid-column-full">
              {/* {% include "breadcrumbs.njk" %} */}
              <h1>{hub.title}</h1>
              <div className="nhsuk-grid-row nhsuk-panel-group nhsuk-u-margin-bottom-0">
                {articles
                  .filter((article) => article.type === 'article')
                  .sort((a, b) => (a.position >= b.position ? 1 : -1))
                  .map((article) => (
                    <div
                      className="nhsuk-grid-column-one-half nhsuk-panel-group__item nhsuk-u-margin-0"
                      key={article.title}
                    >
                      <div className="nhsuk-promo nhsuk-u-margin-bottom-5">
                        <a className="nhsuk-promo__link-wrapper" href={article.slug}>
                          <div className="nhsuk-promo__content">
                            <h2 className="nhsuk-promo__heading">{article.title}</h2>
                            <p className="nhsuk-promo__description">{article.subtitle}</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* // {% include "footer.njk" %} */}
    </div>
  );
}

type Params = {
  params: {
    hub: string;
  };
};

export function generateMetadata({ params }: Params) {
  const post = getContent(params.hub + '/index');
  if (!post) {
    return notFound();
  }

  return {
    title: post.title || 'NHS login Help centre',
  };
}

export async function generateStaticParams() {
  const articles = getAllHubs();

  return articles.map((post) => ({
    hub: post.name,
  }));
}

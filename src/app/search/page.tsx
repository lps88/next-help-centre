import { getAllArticles } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import SearchResult from '../_components/search';
import Header from '../_components/header';

export default async function Search() {
  const searchData = await Promise.all(
    getAllArticles()
      .filter((f) => f.type === 'article')
      .map((file) =>
        markdownToHtml(file.markdownContent).then(({ headings }) => {
          return headings.map((heading) => ({ ...heading, slug: file.slug }));
        })
      )
  );
  return (
    <span>
      {/* {% include "cookie-banner.njk" %} */}
      <Header></Header>
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper" role="main">
          {/* {% include "breadcrumbs.njk" %} */}
          <div className="nhsuk-grid-row">
            <SearchResult searchData={searchData.flat()}></SearchResult>
          </div>
        </main>
        {/* <script src={{ "/js/back-link.js" | url }}></script> */}
        {/* <script src={{ "/js/cookie-banner.js" | url }}></script> */}
        {/* {% include "footer.njk" %} */}
      </div>
    </span>
  );
}

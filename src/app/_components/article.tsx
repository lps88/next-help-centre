import ArticleNavList from '@/app/_components/nav-list';
import { MarkdownDocument } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';

const level = 2;

export default async function Article({ post }: Props) {
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
                      .filter(
                        ({ className }) =>
                          !className || className.indexOf('nhsuk-u-visually-hidden') === -1
                      )
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

type Props = {
  post: MarkdownDocument;
};
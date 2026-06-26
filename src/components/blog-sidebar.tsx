import Link from "next/link";
import { articles } from "@/data/articles";

export function BlogSidebar() {
  return (
    <>
      <div className="panel blog-panel">
        <div className="blog-panel-header">
          <h3>Latest insights</h3>
          <Link href="/insights">View all &rarr;</Link>
        </div>
        <div className="blog-scroll">
          {articles.map((article) => (
            <Link key={article.slug} href={`/insights/${article.slug}`} className="blog-teaser">
              <span className="blog-teaser-cat">{article.category}</span>
              <strong>{article.title}</strong>
              <p>{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="panel blog-cta-panel">
        <h3>Get the full picture</h3>
        <p>Every article links to real research, DWP guidance and employer case studies.</p>
        <Link href="/insights" className="blog-cta">Read all insights</Link>
      </div>
    </>
  );
}

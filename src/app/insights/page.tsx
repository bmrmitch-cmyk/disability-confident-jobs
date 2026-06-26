import Link from "next/link";
import { articles } from "@/data/articles";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Analysis | AccessWork — Disability Employment Research",
  description: "In-depth articles on disability employment, reasonable adjustments, neurodiversity at work, and the Disability Confident scheme.",
};

export default function InsightsPage() {
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <main className="insights-page">
      <Breadcrumbs items={[{ label: "Insights" }]} />

      <div className="insights-hero">
        <div>
          <span className="insights-badge">Knowledge base</span>
          <h1>Insights &amp; analysis</h1>
          <p>Research, guides and practical advice on disability employment, reasonable adjustments, neurodiversity at work, and the Disability Confident scheme.</p>
        </div>
        <div className="insights-stats">
          <span><strong>{articles.length}</strong> articles</span>
          <span><strong>{categories.length}</strong> categories</span>
          <span><strong>8&ndash;12</strong> min read</span>
        </div>
      </div>

      <div className="category-tabs">
        <Link href="/insights" className="active">All articles</Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/insights?category=${encodeURIComponent(cat)}`}>{cat}</Link>
        ))}
      </div>

      <div className="insights-grid">
        {articles.map((article, i) => (
          <Link key={article.slug} href={`/insights/${article.slug}`} className={`insight-card card-${(i % 4) + 1}`}>
            <span className="insight-card-cat">{article.category}</span>
            <div className="insight-card-body">
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
            </div>
            <div className="insight-card-footer">
              <span className="insight-read">Read article &rarr;</span>
              <small>{article.readTime}</small>
            </div>
          </Link>
        ))}
      </div>

      <div className="insights-cta">
        <h2>Have a topic suggestion?</h2>
        <p>We are building the largest library of disability employment research in the UK. If there is a topic you would like us to cover, get in touch.</p>
        <Link href="/profile" className="scan-button">Suggest a topic</Link>
      </div>
    </main>
  );
}

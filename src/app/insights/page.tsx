import Link from "next/link";
import { articles } from "@/data/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Analysis | AccessWork — Disability Employment Research",
  description: "In-depth articles on disability employment, reasonable adjustments, neurodiversity at work, and the Disability Confident scheme.",
};

export default function InsightsPage() {
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <main className="insights-page">
      <div className="insights-header">
        <h1>Insights & Analysis</h1>
        <p>Research, guides and advice on disability employment, reasonable adjustments, and inclusive workplaces.</p>
      </div>

      <div className="category-tabs">
        <Link href="/insights" className="active">All</Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/insights?category=${encodeURIComponent(cat)}`}>{cat}</Link>
        ))}
      </div>

      <div className="insights-grid">
        {articles.map((article) => (
          <Link key={article.slug} href={`/insights/${article.slug}`} className="insight-card">
            <div className="insight-card-header">
              <span>{article.category}</span>
              <small>{article.readTime}</small>
            </div>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <span className="insight-read">Read article &rarr;</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

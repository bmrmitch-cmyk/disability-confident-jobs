import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/articles";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} | AccessWork Insights`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <main className="article-page">
      <Link href="/insights" className="back-link">&larr; Back to insights</Link>
      <article>
        <header className="article-header">
          <div className="article-meta">
            <span>{article.category}</span>
            <small>{article.readTime}</small>
          </div>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </header>
        <div className="article-body">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
      <nav className="article-nav">
        <h3>More articles</h3>
        <div className="article-nav-list">
          {articles.filter((a) => a.slug !== slug).slice(0, 3).map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`}>
              <span>{a.category}</span>
              <strong>{a.title}</strong>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

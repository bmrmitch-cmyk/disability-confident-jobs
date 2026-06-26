import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/articles";
import { Breadcrumbs } from "@/components/breadcrumbs";
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

  const more = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <main className="article-page">
      <Breadcrumbs items={[
        { label: "Insights", href: "/insights" },
        { label: article.title },
      ]} />

      <article className="article-content">
        <header className="article-header">
          <div className="article-meta">
            <span className="article-cat-badge">{article.category}</span>
            <span className="article-read-time">{article.readTime} read</span>
          </div>
          <h1>{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
        </header>

        <div className="article-body">
          {article.body.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "article-lead" : ""}>{paragraph}</p>
          ))}
        </div>

        <div className="article-share">
          <span>Share this article</span>
          <div className="share-links">
            <Link href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://disability-confident-platform.vercel.app/insights/${article.slug}`)}`} target="_blank" rel="noreferrer">Twitter</Link>
            <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://disability-confident-platform.vercel.app/insights/${article.slug}`)}`} target="_blank" rel="noreferrer">LinkedIn</Link>
            <Link href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`https://disability-confident-platform.vercel.app/insights/${article.slug}`)}`}>Email</Link>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <nav className="article-nav">
          <h3>More articles you might like</h3>
          <div className="article-nav-list">
            {more.map((a) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="article-nav-card">
                <span className="article-nav-cat">{a.category}</span>
                <strong>{a.title}</strong>
                <p>{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}

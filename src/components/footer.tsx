import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>AccessWork</h3>
          <p>Live vacancies from Disability Confident employers across the UK. Find roles that work for you.</p>
        </div>
        <div className="footer-col">
          <h4>Quick links</h4>
          <Link href="/">Home</Link>
          <Link href="/insights">Insights & research</Link>
          <Link href="/profile">My profile</Link>
          <Link href="/admin">Admin panel</Link>
        </div>
        <div className="footer-col">
          <h4>For jobseekers</h4>
          <Link href="/?tab=jobs">Browse jobs</Link>
          <Link href="/?tab=employers">Employer directory</Link>
          <Link href="/insights">Career guides</Link>
          <Link href="/profile">Saved jobs</Link>
        </div>
        <div className="footer-col">
          <h4>For employers</h4>
          <Link href="/profile?tab=employer">Employer dashboard</Link>
          <Link href="/profile?tab=employer">Claim your listing</Link>
          <Link href="/profile?tab=employer">Featured jobs</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AccessWork. All role information sourced from Disability Confident employers. Always confirm adjustments and accessibility details on the official vacancy page before applying.</p>
      </div>
    </footer>
  );
}

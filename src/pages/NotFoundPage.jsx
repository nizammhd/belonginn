import { usePg } from '../context/PgContext';

export default function NotFoundPage() {
  const { setActiveTab } = usePg();

  return (
    <main className="not-found wrap">
      <p className="kicker">404</p>
      <h1>We couldn’t find that page</h1>
      <p>The link may be outdated, or the page may have moved.</p>
      <a
        className="btn btn-primary"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          setActiveTab('home');
        }}
      >
        Back to Kerala PG
      </a>
    </main>
  );
}

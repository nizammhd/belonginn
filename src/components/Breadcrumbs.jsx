import { usePg } from '../context/PgContext';

const ITEMS = {
  pgs: { label: 'Our PGs', path: '/properties/' },
  contact: { label: 'Contact', path: '/contact/' }
};

export default function Breadcrumbs({ page }) {
  const { setActiveTab } = usePg();
  const current = ITEMS[page];
  if (!current) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              setActiveTab('home');
            }}
          >
            Home
          </a>
        </li>
        <li aria-current="page">{current.label}</li>
      </ol>
    </nav>
  );
}

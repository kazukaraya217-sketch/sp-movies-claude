import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-netflix-red text-2xl font-bold">S-P</span>
          <span className="text-white text-xl font-semibold">Movies</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white hover:text-netflix-red transition-colors"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="text-netflix-light-gray hover:text-white transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
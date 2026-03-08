import { getAllMovies } from '@/lib/db';
import MovieGrid from '@/components/MovieGrid';

export default function Home() {
  const movies = getAllMovies();

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: movies.length > 0 && movies[0].poster_url
              ? `url(${movies[0].poster_url})`
              : 'none',
            backgroundColor: '#141414'
          }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              S-P Movies
            </h1>
            <p className="text-xl text-netflix-light-gray max-w-xl">
              Download your favorite movies from Telegram and Terabox
            </p>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {movies.length > 0 ? 'Popular Movies' : 'No Movies Available'}
        </h2>
        <MovieGrid movies={movies} />
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-10 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-netflix-red text-xl font-bold">S-P</span>
            <span className="text-white text-lg">Movies</span>
          </div>
          <p className="text-netflix-gray text-sm">
            © {new Date().getFullYear()} S-P Movies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
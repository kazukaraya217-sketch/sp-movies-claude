import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  year: number;
  genre: string;
}

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-6xl mb-4">🎬</span>
        <p className="text-netflix-gray text-lg">No movies found</p>
        <p className="text-netflix-gray text-sm mt-2">Check back later for new movies</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          poster_url={movie.poster_url}
          year={movie.year}
          genre={movie.genre}
        />
      ))}
    </div>
  );
}
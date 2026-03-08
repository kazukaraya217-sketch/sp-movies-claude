import Link from 'next/link';
import Image from 'next/image';

interface MovieCardProps {
  id: number;
  title: string;
  poster_url: string;
  year: number;
  genre: string;
}

export default function MovieCard({ id, title, poster_url, year, genre }: MovieCardProps) {
  return (
    <Link href={`/movies/${id}`} className="movie-card block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-netflix-dark">
        {poster_url ? (
          <Image
            src={poster_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
            <p className="text-gray-400 text-xs">{year} • {genre}</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white font-medium text-sm truncate">{title}</h3>
        <p className="text-netflix-gray text-xs">{year}</p>
      </div>
    </Link>
  );
}
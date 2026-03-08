import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovieById } from '@/lib/db';
import DownloadButton from '@/components/DownloadButton';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  const movie = getMovieById(movieId);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-netflix-light-gray hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Movies</span>
        </Link>
      </div>

      {/* Movie Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <span className="text-6xl">🎬</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
              {movie.year && (
                <span className="px-3 py-1 bg-white/10 rounded text-sm text-white">
                  {movie.year}
                </span>
              )}
              {movie.genre && (
                <span className="px-3 py-1 bg-netflix-red rounded text-sm text-white">
                  {movie.genre}
                </span>
              )}
            </div>

            {movie.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                <p className="text-netflix-light-gray leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Download Buttons */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Download</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <DownloadButton
                  href={movie.telegram_link}
                  label="Download from Telegram"
                  icon="✈️"
                  primary={true}
                />
                <DownloadButton
                  href={movie.terabox_link}
                  label="Download from Terabox"
                  icon="📦"
                  primary={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
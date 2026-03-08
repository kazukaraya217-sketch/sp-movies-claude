'use client';

import { useState } from 'react';

interface Movie {
  id?: number;
  title: string;
  description: string;
  poster_url: string;
  telegram_link: string;
  terabox_link: string;
  year: number;
  genre: string;
}

interface AdminMovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Movie) => void;
  onCancel: () => void;
}

export default function AdminMovieForm({ movie, onSubmit, onCancel }: AdminMovieFormProps) {
  const [formData, setFormData] = useState<Movie>({
    title: movie?.title || '',
    description: movie?.description || '',
    poster_url: movie?.poster_url || '',
    telegram_link: movie?.telegram_link || '',
    terabox_link: movie?.terabox_link || '',
    year: movie?.year || new Date().getFullYear(),
    genre: movie?.genre || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-netflix-dark p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        {movie ? 'Edit Movie' : 'Add New Movie'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-netflix-light-gray mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Movie title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-netflix-light-gray mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input-field"
              placeholder="2024"
            />
          </div>
          <div>
            <label className="block text-sm text-netflix-light-gray mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="input-field"
              placeholder="Action"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-netflix-light-gray mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Movie description..."
          />
        </div>

        <div>
          <label className="block text-sm text-netflix-light-gray mb-1">Poster URL</label>
          <input
            type="url"
            name="poster_url"
            value={formData.poster_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/poster.jpg"
          />
        </div>

        <div>
          <label className="block text-sm text-netflix-light-gray mb-1">Telegram Download Link</label>
          <input
            type="url"
            name="telegram_link"
            value={formData.telegram_link}
            onChange={handleChange}
            className="input-field"
            placeholder="https://t.me/..."
          />
        </div>

        <div>
          <label className="block text-sm text-netflix-light-gray mb-1">Terabox Download Link</label>
          <input
            type="url"
            name="terabox_link"
            value={formData.terabox_link}
            onChange={handleChange}
            className="input-field"
            placeholder="https://terabox.com/..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-netflix flex-1"
          >
            {movie ? 'Update Movie' : 'Add Movie'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
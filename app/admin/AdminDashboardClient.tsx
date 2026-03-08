'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminMovieForm from '@/components/AdminMovieForm';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  telegram_link: string;
  terabox_link: string;
  year: number;
  genre: string;
  created_at: string;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch('/api/movies', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch movies on mount
  if (loading) {
    fetchMovies();
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddMovie = (movieData: Omit<Movie, 'id' | 'created_at'>) => {
    const method = editingMovie ? 'PUT' : 'POST';
    const url = editingMovie ? `/api/movies/${editingMovie.id}` : '/api/movies';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          fetchMovies();
          setShowForm(false);
          setEditingMovie(null);
        } else if (data.error) {
          alert('Error: ' + data.error);
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Failed to save movie');
      });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    fetch(`/api/movies/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchMovies();
        } else if (data.error) {
          alert('Error: ' + data.error);
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Failed to delete movie');
      });
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-netflix-gray">Manage your movies</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingMovie(null);
                setShowForm(true);
              }}
              className="btn-netflix"
            >
              + Add Movie
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8">
            <AdminMovieForm
              movie={editingMovie || undefined}
              onSubmit={handleAddMovie}
              onCancel={() => {
                setShowForm(false);
                setEditingMovie(null);
              }}
            />
          </div>
        )}

        {/* Movies Table */}
        <div className="bg-netflix-dark rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-netflix-light-gray">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-netflix-light-gray">Poster</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-netflix-light-gray">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-netflix-light-gray">Year</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-netflix-light-gray">Genre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-netflix-light-gray">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-netflix-gray">{movie.id}</td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden">
                        {movie.poster_url && (
                          <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{movie.title}</td>
                    <td className="px-4 py-3 text-sm text-netflix-gray">{movie.year}</td>
                    <td className="px-4 py-3 text-sm text-netflix-gray">{movie.genre}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-netflix-gray">
                      No movies yet. Click "Add Movie" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6">
          <Link
            href="/"
            className="text-netflix-gray hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
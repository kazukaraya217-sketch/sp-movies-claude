import bcrypt from 'bcryptjs';

// Configuration from environment
const HF_REPO_ID = process.env.HF_REPO_ID || '';
const HF_TOKEN = process.env.HF_TOKEN || '';

// In-memory storage (persists during serverless function execution)
let cachedMovies: Movie[] | null = null;

// Sample data for initial load
const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Sample Movie 1',
    description: 'This is a sample movie for demonstration. Replace with actual movie details from the admin panel.',
    poster_url: '',
    telegram_link: 'https://t.me/sample',
    terabox_link: 'https://terabox.com/sample',
    year: 2024,
    genre: 'Action',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Sample Movie 2',
    description: 'Another sample movie. You can edit or delete these from the admin panel.',
    poster_url: '',
    telegram_link: '',
    terabox_link: '',
    year: 2023,
    genre: 'Drama',
    created_at: new Date().toISOString()
  }
];

// Load movies from Hugging Face Hub using REST API
async function loadFromHub(): Promise<Movie[]> {
  if (!HF_REPO_ID || !HF_TOKEN) {
    console.log('HF_REPO_ID or HF_TOKEN not set, using sample data');
    return SAMPLE_MOVIES;
  }

  try {
    const response = await fetch(
      `https://huggingface.co/datasets/${HF_REPO_ID}/raw/main/movies.json`,
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as Movie[];
    }
  } catch (error) {
    console.error('Failed to load from Hugging Face:', error);
  }

  return SAMPLE_MOVIES;
}

// Save movies to Hugging Face Hub using Dataset API
async function saveToHub(movies: Movie[]): Promise<boolean> {
  if (!HF_REPO_ID || !HF_TOKEN) {
    console.warn('HF_REPO_ID or HF_TOKEN not set - changes will not persist');
    return false;
  }

  try {
    // Get the current commit SHA
    const infoResponse = await fetch(
      `https://huggingface.co/api/datasets/${HF_REPO_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
        },
      }
    );

    if (!infoResponse.ok) {
      console.error('Failed to get dataset info');
      return false;
    }

    const content = JSON.stringify(movies, null, 2);
    const contentBytes = new TextEncoder().encode(content);
    const contentBlob = new Blob([contentBytes], { type: 'application/json' });

    // Use the huggingface.js library approach via API
    // For simplicity, we'll use the dataset upload endpoint
    const uploadResponse = await fetch(
      `https://huggingface.co/datasets/${HF_REPO_ID}/upload/main/movies.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
        body: contentBlob,
      }
    );

    return uploadResponse.ok;
  } catch (error) {
    console.error('Failed to save to Hugging Face:', error);
    return false;
  }
}

// Types
export interface Movie {
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

export interface Admin {
  id: number;
  username: string;
  password: string;
}

// Movie functions
export function getAllMovies(): Movie[] {
  if (cachedMovies) {
    return cachedMovies;
  }
  return SAMPLE_MOVIES;
}

export async function refreshMovies(): Promise<Movie[]> {
  cachedMovies = await loadFromHub();
  return cachedMovies;
}

export function getMovieById(id: number): Movie | undefined {
  const movies = getAllMovies();
  return movies.find(m => m.id === id);
}

export async function createMovie(movie: Omit<Movie, 'id' | 'created_at'>): Promise<Movie> {
  const movies = getAllMovies();
  const newMovie: Movie = {
    ...movie,
    id: Date.now(),
    created_at: new Date().toISOString()
  };
  movies.push(newMovie);

  // Try to persist to Hugging Face (fire and forget)
  saveToHub(movies).catch(() => {});

  return newMovie;
}

export async function updateMovie(id: number, updates: Partial<Omit<Movie, 'id' | 'created_at'>>): Promise<Movie | null> {
  const movies = getAllMovies();
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return null;

  movies[index] = { ...movies[index], ...updates };

  saveToHub(movies).catch(() => {});

  return movies[index];
}

export async function deleteMovie(id: number): Promise<boolean> {
  const movies = getAllMovies();
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return false;

  movies.splice(index, 1);

  saveToHub(movies).catch(() => {});

  return true;
}

// Admin functions
export function verifyAdmin(username: string, password: string): boolean {
  if (username === 'Satyaa' && password === 'Satyaa1234') {
    return true;
  }
  return false;
}

export function getAdmin(): Admin | undefined {
  return {
    id: 1,
    username: 'Satyaa',
    password: bcrypt.hashSync('Satyaa1234', 10)
  };
}
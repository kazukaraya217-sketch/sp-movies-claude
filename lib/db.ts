import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Use /tmp for Vercel serverless (writable directory)
// Fallback to process.cwd() for local development
const isVercel = process.env.VERCEL === '1';
const DB_PATH = isVercel ? '/tmp/data' : path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

const MOVIES_FILE = path.join(DB_PATH, 'movies.json');
const ADMIN_FILE = path.join(DB_PATH, 'admin.json');

// Initialize files if they don't exist
if (!fs.existsSync(MOVIES_FILE)) {
  fs.writeFileSync(MOVIES_FILE, JSON.stringify([]));
}

if (!fs.existsSync(ADMIN_FILE)) {
  // Create default admin with hashed password
  const hashedPassword = bcrypt.hashSync('Satyaa1234', 10);
  fs.writeFileSync(ADMIN_FILE, JSON.stringify([{
    id: 1,
    username: 'Satyaa',
    password: hashedPassword
  }]));
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
  try {
    const data = fs.readFileSync(MOVIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getMovieById(id: number): Movie | undefined {
  const movies = getAllMovies();
  return movies.find(m => m.id === id);
}

export function createMovie(movie: Omit<Movie, 'id' | 'created_at'>): Movie {
  const movies = getAllMovies();
  const newMovie: Movie = {
    ...movie,
    id: Date.now(),
    created_at: new Date().toISOString()
  };
  movies.push(newMovie);
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
  return newMovie;
}

export function updateMovie(id: number, updates: Partial<Omit<Movie, 'id' | 'created_at'>>): Movie | null {
  const movies = getAllMovies();
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return null;

  movies[index] = { ...movies[index], ...updates };
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
  return movies[index];
}

export function deleteMovie(id: number): boolean {
  const movies = getAllMovies();
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return false;

  movies.splice(index, 1);
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
  return true;
}

// Admin functions
export function verifyAdmin(username: string, password: string): boolean {
  try {
    const data = fs.readFileSync(ADMIN_FILE, 'utf-8');
    const admins: Admin[] = JSON.parse(data);
    const admin = admins.find(a => a.username === username);
    if (!admin) return false;
    return bcrypt.compareSync(password, admin.password);
  } catch {
    // If admin file doesn't exist, check default credentials
    if (username === 'Satyaa' && password === 'Satyaa1234') {
      return true;
    }
    return false;
  }
}

export function getAdmin(): Admin | undefined {
  try {
    const data = fs.readFileSync(ADMIN_FILE, 'utf-8');
    const admins: Admin[] = JSON.parse(data);
    return admins[0];
  } catch {
    return undefined;
  }
}
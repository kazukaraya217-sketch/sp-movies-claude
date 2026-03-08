import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase clients - nullable for type safety
// Public client for client-side operations
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
 ? createClient(supabaseUrl, supabaseAnonKey)
 : null;

// Admin client for server-side operations (bypasses RLS)
const supabaseAdmin: SupabaseClient | null = supabaseUrl && supabaseServiceKey
 ? createClient(supabaseUrl, supabaseServiceKey, {
   auth: { persistSession: false }
 })
 : null;

// Get the appropriate client based on whether we have service key
function getClient(): SupabaseClient | null {
 return supabaseServiceKey ? supabaseAdmin : supabase;
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

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// In-memory cache for development/fallback
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

// Load movies from Supabase
async function loadFromSupabase(): Promise<Movie[]> {
 const client = getClient();
 if (!client) {
   console.warn('Supabase not configured, using sample data');
   return SAMPLE_MOVIES;
 }

 const { data, error } = await client
   .from('movies')
   .select('*')
   .order('created_at', { ascending: false });

 if (error) {
   console.error('Failed to load from Supabase:', error);
   return SAMPLE_MOVIES;
 }

 return data as Movie[];
}

// Save movie to Supabase
async function saveToSupabase(movie: Omit<Movie, 'id' | 'created_at'>): Promise<Movie> {
 const client = getClient();
 if (!client) {
   throw new Error('Supabase not configured');
 }

 const { data, error } = await client
   .from('movies')
   .insert({
     title: movie.title,
     description: movie.description,
     poster_url: movie.poster_url,
     telegram_link: movie.telegram_link,
     terabox_link: movie.terabox_link,
     year: movie.year,
     genre: movie.genre
   })
   .select()
   .single();

 if (error) {
   console.error('Failed to save to Supabase:', error);
   throw error;
 }

 return data as Movie;
}

// Update movie in Supabase
async function updateInSupabase(id: number, updates: Partial<Omit<Movie, 'id' | 'created_at'>>): Promise<Movie> {
 const client = getClient();
 if (!client) {
   throw new Error('Supabase not configured');
 }

 const { data, error } = await client
   .from('movies')
   .update(updates)
   .eq('id', id)
   .select()
   .single();

 if (error) {
   console.error('Failed to update in Supabase:', error);
   throw error;
 }

 return data as Movie;
}

// Delete movie from Supabase
async function deleteFromSupabase(id: number): Promise<boolean> {
 const client = getClient();
 if (!client) {
   throw new Error('Supabase not configured');
 }

 const { error } = await client
   .from('movies')
   .delete()
   .eq('id', id);

 if (error) {
   console.error('Failed to delete from Supabase:', error);
   return false;
 }

 return true;
}

// Movie functions
export function getAllMovies(): Movie[] {
 if (cachedMovies) {
   return cachedMovies;
 }
 return SAMPLE_MOVIES;
}

export async function refreshMovies(): Promise<Movie[]> {
 if (isSupabaseConfigured) {
   cachedMovies = await loadFromSupabase();
 } else {
   cachedMovies = SAMPLE_MOVIES;
 }
 return cachedMovies || [];
}

export async function getMovieById(id: number): Promise<Movie | undefined> {
 if (!cachedMovies) {
   await refreshMovies();
 }
 return cachedMovies?.find(m => m.id === id);
}

export async function createMovie(movie: Omit<Movie, 'id' | 'created_at'>): Promise<Movie> {
 if (isSupabaseConfigured) {
   const newMovie = await saveToSupabase(movie);
   await refreshMovies();
   return newMovie;
 } else {
   // Fallback to in-memory
   if (!cachedMovies) {
     cachedMovies = [...SAMPLE_MOVIES];
   }
   const newMovie: Movie = {
     ...movie,
     id: Date.now(),
     created_at: new Date().toISOString()
   };
   cachedMovies.push(newMovie);
   return newMovie;
 }
}

export async function updateMovie(id: number, updates: Partial<Omit<Movie, 'id' | 'created_at'>>): Promise<Movie | null> {
 if (isSupabaseConfigured) {
   try {
     const updated = await updateInSupabase(id, updates);
     await refreshMovies();
     return updated;
   } catch {
     return null;
   }
 } else {
   // Fallback to in-memory
   if (!cachedMovies) {
     return null;
   }
   const index = cachedMovies.findIndex(m => m.id === id);
   if (index === -1) return null;

   cachedMovies[index] = { ...cachedMovies[index], ...updates };
   return cachedMovies[index];
 }
}

export async function deleteMovie(id: number): Promise<boolean> {
 if (isSupabaseConfigured) {
   const success = await deleteFromSupabase(id);
   if (success) {
     await refreshMovies();
   }
   return success;
 } else {
   // Fallback to in-memory
   if (!cachedMovies) {
     return false;
   }
   const index = cachedMovies.findIndex(m => m.id === id);
   if (index === -1) return false;

   cachedMovies.splice(index, 1);
   return true;
 }
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
import { NextRequest, NextResponse } from 'next/server';
import { getAllMovies, createMovie } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const movies = getAllMovies();
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, poster_url, telegram_link, terabox_link, year, genre } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const movie = await createMovie({
      title,
      description: description || '',
      poster_url: poster_url || '',
      telegram_link: telegram_link || '',
      terabox_link: terabox_link || '',
      year: year || new Date().getFullYear(),
      genre: genre || '',
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
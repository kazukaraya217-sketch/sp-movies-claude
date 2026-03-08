import { NextRequest, NextResponse } from 'next/server';
import { getMovieById, updateMovie, deleteMovie } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

interface MovieRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: MovieRouteParams) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const movie = await getMovieById(movieId);

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: MovieRouteParams) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const movieId = parseInt(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, poster_url, telegram_link, terabox_link, year, genre } = body;

    const movie = await updateMovie(movieId, {
      title,
      description,
      poster_url,
      telegram_link,
      terabox_link,
      year,
      genre,
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: MovieRouteParams) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const movieId = parseInt(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const deleted = await deleteMovie(movieId);

    if (!deleted) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
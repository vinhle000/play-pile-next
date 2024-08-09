import React from 'react';
import SearchPageClient from './SearchPageClient';
import { getColumnsOnBoard } from '@/lib/utils/column-utils';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// TODO:  Refine data fetching when first loading and after updating userGame data;
// [ ]: make it so page does not refresh after adding a game to a list(column). Possibly memoize?
// [ ]: Page starts with correct data

// NOTE: Should create util functions for Game CRUD to use directly as server component.
// And client component if necessary.
async function searchGames(query) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/games/search?q=${encodeURIComponent(query)}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }

  return res.json();
}

export default async function Page({ searchParams }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const searchQuery = searchParams.q || '';
  let games = [];
  let columnsOnBoard = [];
  let error = null;
  try {
    games = await searchGames(searchQuery);
    columnsOnBoard = await getColumnsOnBoard(userId);
  } catch (err) {
    error = err.message;
    console.error('Error searching... ', error);
  }

  return (
    <>
      {games?.length === 0 ? (
        <div className="p-6 text-center text-black/60 text-lg">
          No search results found for "{searchQuery}"
        </div>
      ) : (
        <SearchPageClient games={games} columnsOnBoard={columnsOnBoard} />
      )}
    </>
  );
}

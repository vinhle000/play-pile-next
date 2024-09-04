import React from 'react';
import SearchPageClient from './SearchPageClient';
import { getColumnsOnBoard } from '@/lib/utils/column-utils';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import { getGameSearchResults } from '@/lib/utils/game-utils';
import { getUserGamesByIgdbIds } from '@/lib/utils/user-game-utils';

async function getData(searchQuery, userId) {
  let error = null;
  try {
    const games = await getGameSearchResults(searchQuery);
    const userGamesByIgdbIds = await getUserGamesByIgdbIds(
      games.map((g) => g.igdbId),
    );
    const columnsOnBoard = await getColumnsOnBoard(userId);

    return {
      games,
      userGamesByIgdbIds,
      columnsOnBoard,
    };
  } catch (err) {
    error = err.message;
    console.error('Error getting data for search', error);
    return {};
  }
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

  const { games, userGamesByIgdbIds, columnsOnBoard } = await getData(
    searchQuery,
    userId,
  );

  return (
    <>
      {games?.length === 0 ? (
        <div className="p-6 text-center text-black/60 text-lg">
          No search results found for "{searchQuery}"
        </div>
      ) : (
        <SearchPageClient
          games={games}
          columnsOnBoard={columnsOnBoard}
          userGamesByIgdbIds={userGamesByIgdbIds}
        />
      )}
    </>
  );
}

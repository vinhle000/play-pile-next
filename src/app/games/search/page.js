import React from 'react';
import SearchPageClient from './SearchPageClient';

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
  const searchQuery = searchParams.q || '';
  let games = [];
  let error = null;
  try {
    games = await searchGames(searchQuery);
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
        <SearchPageClient games={games} />
      )}
    </>
  );
}

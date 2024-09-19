'use client';
import React from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import SearchResultsListItem from './SearchResultsListItem';
import { Link } from 'react-router-dom';

function SearchResultsList({
  games,
  userGamesByIgdbIds,
  setSelectedGame,
  setOpenModal,
  columnsOnBoard,
  handleUpdateGameFields,
}) {
  return (
    <>
      <ul role="list" className="mx-4 py-5 space-y-4 divide-gray-100">
        {games &&
          games.map((game) => (
            <SearchResultsListItem
              key={game?.igdbId}
              game={game}
              userGame={userGamesByIgdbIds[game.igdbId] || {}}
              setSelectedGame={setSelectedGame}
              setOpenModal={setOpenModal}
              columnsOnBoard={columnsOnBoard}
              handleUpdateGameFields={handleUpdateGameFields}
            />
          ))}
      </ul>
    </>
  );
}

export default SearchResultsList;

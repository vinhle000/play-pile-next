'use client';

import React, { useState } from 'react';
import SearchResultsList from './SearchResultsList';
import ConfirmModal from '@/components/ConfirmModal';

export default function SearchPageClient({ games }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [openModal, setOpenModal] = useState('');
  const userGamesByIgdbId = {}; // TODO: Replace with userGamesContextProvider

  //TODO: Create a userGamesContextProvider and use it here
    //Mapping by ID to find each userGame data, instead of scanning array
    // let userPlayPileGamesByIgdbId = {};
    // if (userPlayPileGames?.length > 0) {
    //   userPlayPileGamesByIgdbId = userPlayPileGames.reduce((acc, game) => {
    //     acc[game.igdbId] = game;
    //     return acc;
    //   });
    // }

  const handleRemoveGameFromPlayPile = async () => {
    // TODO: Implement your remove game logic here
    // try {
    //   await  updateUserGameData(selectedGame.igdbId, {isInPlayPile: false})   // <--- THIS WILL BE is from the userGamesContextProvider
    // } catch (error) {
    //   console.error('Error removing game from play pile', error)
    // } finally {
    //   setOpenModal('')
    // }
    setOpenModal('');
  };

  return (
    <>
      <div className="max-w-5xl mx-6 rounded-2xl bg-gray-100/20 shadow-2xl backdrop-blur-sm backdrop-filter">
        <SearchResultsList
          games={games}
          userGamesByIgdbId={userGamesByIgdbId}
          setSelectedGame={setSelectedGame}
          setOpenModal={setOpenModal}
        />
      </div>

      {openModal === 'remove' && (
        <ConfirmModal
          title="Remove Game"
          description="This game will be removed from your play pile. But your data with game still remain. In case, you change your mind :)"
          onConfirm={handleRemoveGameFromPlayPile}
          onCancel={() => setOpenModal('')}
        />
      )}
    </>
  );
}
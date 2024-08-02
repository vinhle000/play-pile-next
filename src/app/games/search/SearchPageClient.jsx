'use client';

import React, { useState, useContext } from 'react';
import SearchResultsList from './SearchResultsList';
import ConfirmModal from '@/components/ConfirmModal';
import { UserGamesContext } from '@/app/providers/UserGamesProvider';
import { TailSpin } from 'react-loader-spinner';

export default function SearchPageClient({ games }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [openModal, setOpenModal] = useState('');

  const { userGames, updateUserGameData, loading } =
    useContext(UserGamesContext);

  let userGamesByIgdbId = {};
  if (!loading) {
    //FIXME: getting empty object after reduce
    //Mapping by ID to find each userGame data, instead of scanning array
    if (userGames?.length > 0) {
      userGamesByIgdbId = userGames.reduce((acc, userGame) => {
        acc[userGame.igdbId] = userGame;
        return acc;
      });
    }
  }

  const handleRemoveGameFromPlayPile = async () => {
    // TODO: Implement your remove game logic here
    try {
      await updateUserGameData(selectedGame.igdbId, { isInPlayPile: false }); // <--- THIS WILL BE is from the userGamesContextProvider
    } catch (error) {
      console.error('Error removing game from play pile', error);
    } finally {
      setOpenModal('');
    }
    setOpenModal('');
  };

  return (
    <>
      <div className="flex flex-col items-center mt-12 ">
        {loading ? (
          <TailSpin color="black" radius="1rem" />
        ) : (
          <>
            {games?.length === 0 ? (
              <div className="p-6 text-center text-black/60 text-lg">
                No search results found
              </div>
            ) : (
              <div className="max-w-5xl mx-6 rounded-2xl bg-gray-100/20 shadow-2xl backdrop-blur-sm backdrop-filter ">
                <SearchResultsList
                  games={games}
                  userGamesByIgdbId={userGamesByIgdbId}
                  setSelectedGame={setSelectedGame}
                  setOpenModal={setOpenModal}
                />
              </div>
            )}
          </>
        )}
      </div>

      {openModal === 'remove' && (
        <ConfirmModal
          title="Remove Game"
          description="This game will be removed from your play pile. But your data with game still remain. In case, you change your mind :) " //To permanetly delete?
          onConfirm={handleRemoveGameFromPlayPile}
          onCancel={() => setOpenModal('')}
        />
      )}
    </>
  );

  // return (
  //   <>
  //     <div className="max-w-5xl mx-6 rounded-2xl bg-gray-100/20 shadow-2xl backdrop-blur-sm backdrop-filter">
  //       <SearchResultsList
  //         games={games}
  //         userGamesByIgdbId={userGamesByIgdbId}
  //         setSelectedGame={setSelectedGame}
  //         setOpenModal={setOpenModal}
  //       />
  //     </div>

  //     {openModal === 'remove' && (
  //       <ConfirmModal
  //         title="Remove Game"
  //         description="This game will be removed from your play pile. But your data with game still remain. In case, you change your mind :)"
  //         onConfirm={handleRemoveGameFromPlayPile}
  //         onCancel={() => setOpenModal('')}
  //       />
  //     )}
  //   </>
  //);
}

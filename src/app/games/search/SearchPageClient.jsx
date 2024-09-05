'use client';

import React, { useState, useContext, useCallback } from 'react';
import SearchResultsList from './SearchResultsList';
import ConfirmModal from '@/components/ConfirmModal';
import { UserGamesContext } from '@/app/providers/UserGamesProvider';
import { TailSpin } from 'react-loader-spinner';

export default function SearchPageClient({ games, columnsOnBoard, userGamesByIgdbIds}) {
  const [localUserGamesByIgdbIds, setLocalUserGamesByIgdbIds] = useState(userGamesByIgdbIds);
  const [selectedGame, setSelectedGame] = useState(null);
  const [openModal, setOpenModal] = useState('');

  const { userGames, updateUserGameData, loading } =
    useContext(UserGamesContext);


    const handleRemoveGameFromPlayPile = useCallback(async () => {
      //NOTE: Probably could be refactored to use handleUpdateGameFields
      try {
      setLocalUserGamesByIgdbIds((prevState) => ({
        ...prevState,
        [selectedGame.igdbId]: {
          ...prevState[selectedGame.igdbId],
          columnId: null,
          isInPlayPile: false
        }
      }));
        // Update on the server
        await updateUserGameData(selectedGame.igdbId, {
          columnId: null,
          isInPlayPile: false
        });


      } catch (error) {
        console.error('Error removing game from play pile', error);
      } finally {
        setOpenModal('');
      }
    }, [selectedGame, updateUserGameData, setLocalUserGamesByIgdbIds]);

    const handleUpdateGameFields = useCallback( async (igdbId, updatedFields) => {
      updatedFields ? updatedFields : {};
        try {

          setLocalUserGamesByIgdbIds((prev) => (
            {
              ...prev,
              [igdbId]: {
                ...prev[igdbId],
                ...updatedFields,
              },
            }
          ))
          let newData = await updateUserGameData(igdbId, {
            ...updatedFields,
          });
        } catch (error) {
          console.error('Error updating UserGame Data ', error);
        }
       }, [updateUserGameData, setLocalUserGamesByIgdbIds]
    );

    //TODO: Add a loading spinner for initial search loading
  return (
    <>
      <div className="flex flex-col items-center mt-12 ">
        {false ? (
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
                  userGamesByIgdbIds={localUserGamesByIgdbIds}
                  setSelectedGame={setSelectedGame}
                  setOpenModal={setOpenModal}
                  columnsOnBoard={columnsOnBoard}
                  handleUpdateGameFields={handleUpdateGameFields}
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
}

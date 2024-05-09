import React, { useState, useContext } from 'react';
import GameCard from './GameCard';
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext';
import ConfirmModal from '@/components/ConfirmModal';
import UserGameDataEditModal from '@/components/UserGameDataEditModal';
import userGameService from '@/services/userGameService';




function GameCardList({ games }) {
  const { loading, fetchUserPlayPileGames } = useContext(UserPlayPileGamesContext);
  const [modalState, setModalState] = useState('');
  const [editGame, setEditGame] = useState({});

  if (loading) {
    return <h3>Loading...</h3>;
  }

  ///TODO - add more popover otopns to ch

  const handleOpenEditModal = (game) => {
    setModalState('edit');
    setEditGame(game);
  };

  const handleRemoveConfirm = async () => {
    try {
      await userGameService.updateUserGameData(editGame.igdbId, { isInPlayPile: "false" });
      fetchUserPlayPileGames();
      setModalState('');
    } catch (error) {
      console.error('Error removing game:', error);
    }
  };

  return (
    <div className="mx-auto px-4 py-8  dark:bg-gray-800">
      <div className="flex flex-wrap justify-start items-stretch gap-4">
        {games.map(game => (


             <div key={game.igdbId} className="rounded-md space-y-1 drop-shadow-md ">
               <div className="flex justify-between items-center p-4"
                  onClick={(e) => handleOpenEditModal(e, game)}
               >
                 <img
                   src={game.gameInfo.coverUrl}
                   alt={game.gameInfo.name}
                   className="rounded-sm   min-w-12 h-15  transition duration-300 ease-in-out transform group-hover:scale-110 group-hover:brightness-50 object-cover"
                 />
                 <div
                   onClick={() => handleOpenEditModal(game)}
                   className="absolute inset-0 flex items-center
                               justify-center opacity-0 group-hover:opacity-100
                               transition-opacity duration-300"
                 >
                   {/* <p className="text-white text-xl font-bold">{game.gameInfo.name}</p> */}
                 </div>
               </div>
             </div>
            // <NewGameCard game={game} />

        ))}
      </div>

      {modalState === 'remove' && (
        <ConfirmModal
          title="Remove Game"
          description="Are you sure you want to remove this game from your Play Pile?"
          onConfirm={handleRemoveConfirm}
          onCancel={() => setModalState('')}
        />
      )}

      {modalState === 'edit' && (
        <UserGameDataEditModal
          game={editGame}
          modalState={modalState}
          setModalState={setModalState}
        />
      )}
    </div>
  );
}

export default GameCardList;

import { useState, useContext } from 'react';

import PlayPileGameCard from '@/components/PlayPileGameCard';
import ConfirmModal from '@/components/ConfirmModal';
import userGameService from '@/services/userGameService';
import UserPlayPileGamesContext  from '@/contexts/UserPlayPileGamesContext'

function PlayPileGameList() {

  const {userPlayPileGames, loading, fetchUserPlayPileGames, updateUserGameData} = useContext(UserPlayPileGamesContext);

  const [deleteModalState, setDeleteModalState] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState({});

  console.log('PlayPileList -> UserPlayPileGames', userPlayPileGames)


  //NOTE: May not need
  const handleDeleteConfirm = async () => {
    try {
      await updateUserGameData(selectedGame.igdbId, { isInPlayPile: "false" });
      fetchUserPlayPileGames();
      setModalState('');
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };



  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="mx-6 rounded-2xl  bg-gray-100/20  shadow-md backdrop-filter">
      <div className="flex flex-wrap items-center">
        {userPlayPileGames && userPlayPileGames.map(game => (
          <PlayPileGameCard key={game.igdbId} game={game} />
        ))}
      </div>

      {deleteModalState && (
        <ConfirmModal
          title="Remove Game"
          description="Are you sure you want to remove this game from your Play Pile?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setModalState('')}
        />
      )}
    </div>
  );
}

export default PlayPileGameList;
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import userGameService from '@/services/userGameService';
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext';
import useUserGameData from '@/hooks/useUserGameData';
import LogRocket from 'logrocket';

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  Playing: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  'Not playing': '',
  Abandoned: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
};

const platformsNames = {
  'Nintendo Entertainment System': 'NES',
  'Family Computer': 'Famicom',
  'Family Computer Disk System': 'Famicom Disk System',
  'Super Nintendo': 'SNES',
  'Nintendo 64': 'N64',
};

function SearchResultsListItem({ game }) {

  const { userPlayPileGames, setUserPlayPileGames, loading, updateUserGameData } = useContext(UserPlayPileGamesContext)
  const [userGameData, setUserGameData] = useUserGameData({
    status: game.status,
    isInPlayPile: game.isInPlayPile,
  });


  const updateUserGame = async (igdbId, updateData) => {
    updateData ? updateData : {};
    try {
      //FIXME: Only update the listItem as User edits the their relationship with the game
      let newData = await updateUserGameData(igdbId, {
        ...updateData,
      });

      setUserGameData({ ...userGameData, ...newData });
      LogRocket.log('userGameData updated successfully', newData);
    } catch (error) {
      console.error('Error updating UserGame Data ', error);
      LogRocket.error('Error updating UserGame Data ', error);
    }
  };

  return (
    <li className="flex items-center justify-between py-5">
      <div className="flex gap-x-6">
        <div>
          <Link to={'/games/' + game.igdbId}>
            <img
              src={game.cover.url}
              alt=""
              className="rounded-sm min-w-48 h-60 object-cover" />
          </Link>
        </div>

        <div className="flex flex-col">

          <div className="flex justify-start gap-x-2">
          <Link to={'/games/' + game.igdbId}>
            <p className="text-2xl font-semibold text-gray-900">
              {game.name}
            </p>
          </Link>

          </div>

          <div className="flex mt-4 text-gray-500">
            <p>PlayStatus</p>
          </div>

          <div className="flex-col justify-between mt-6 max-w-120">
            <div className="flex items-center  gap-x-2 text font-medium leading-5 text-gray-900">
              Initial Release:
              <p className="whitespace-nowrap font-light">
                <time>
                  {new Date(game.firstReleaseDate).toLocaleDateString(
                    undefined,
                    { month: 'long', year: 'numeric' }
                  )}
                </time>
              </p>
            </div>

            <div className="flex flex-wrap justify-normal mt-2.5 font-medium leading-5 ">
              <p className="py-1 text-m">Genres: </p>
              {game.genres.map((genre) => (
                <div
                  key={genre.id}
                  className="rounded-md whitespace-nowrap m-1 px-2 py-0.5 text-xs font-medium ring-2 ring-inset"
                >
                  {genre.name}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-normal mt-2.5 font-medium leading-5 max-w-80">
              <p className="py-1 text-m"> Platforms: </p>
              {game.platforms.map((platform) => (
                <div
                  key={platform.id}
                  className="rounded-md whitespace-nowrap m-1 px-2 py-0.5 text-xs font-medium ring-2 ring-inset"
                >
                  {platformsNames[platform.name]
                    ? platformsNames[platform.name]
                    : platform.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {/* //FIXME: Remove button does not appear after page refresh */}
        {userGameData.isInPlayPile ? (
          <button
            onClick={() =>
              updateUserGame(game.igdbId, { isInPlayPile: false })
            }
            className="min-w-32 mx-5 px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-300 transition-colors"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() =>
              updateUserGame(game.igdbId, { isInPlayPile: true })
            }
            className="min-w-32 mx-5 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Add
          </button>
        )}
      </div>
    </li>
  );
}

export default SearchResultsListItem;

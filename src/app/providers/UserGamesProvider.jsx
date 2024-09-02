'use client';
import React, { createContext, useState, useCallback, useMemo } from 'react';
import userGameService from '@/services/userGameService';

export const UserGamesContext = createContext();

export default function UserGamesProvider({
  children,
  initialUserGames,
  initialUserGamesOnBoard,
}) {
  const [userGames, setUserGames] = useState(initialUserGames);
  const [userGamesOnBoard, setUserGamesOnBoard] = useState(
    initialUserGamesOnBoard,
  );
  const [loading, setLoading] = useState(true);

  const fetchUserGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userGameService.getUserGames();
      setUserGames(response);
    } catch (error) {
      console.error('Error fetching user play pile', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGamesOnBoard = useCallback(async () => {
    try {
      setLoading(true);
      const gamesOnBoard = await userGameService.getUserGamesOnBoard();
      setUserGamesOnBoard(gamesOnBoard || {});
    } catch (error) {
      console.error('Error fetching user play pile', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserGameData = useCallback(
    async (gameIgdbId, updateData) => {
      try {
        setLoading(true);
        await userGameService.updateUserGameData(gameIgdbId, updateData);
        fetchGamesOnBoard();
      } catch (error) {
        console.error('Error updating userGame columnId ', error);
      } finally {
        setLoading(false);
      }
    },
    [fetchGamesOnBoard],
  );

  const updateUserGameColumnPositions = useCallback(
    async (updatedColumnUserGames) => {
      try {
        setLoading(true);
        await userGameService.updateUserGameColumnPositions(
          updatedColumnUserGames,
        );
      } catch (error) {
        console.error('Error updating userGame columnId ', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Memoize the context value to avoid re-renders of consuming components
  const contextValue = useMemo(
    () => ({
      loading,
      userGames,
      setUserGames,
      fetchUserGames,
      userGamesOnBoard,
      setUserGamesOnBoard,
      fetchGamesOnBoard,
      updateUserGameData,
      updateUserGameColumnPositions,
    }),
    [
      loading,
      userGames,
      userGamesOnBoard,
      fetchUserGames,
      fetchGamesOnBoard,
      updateUserGameData,
      updateUserGameColumnPositions,
    ],
  );

  return (
    <UserGamesContext.Provider value={contextValue}>
      {children}
    </UserGamesContext.Provider>
  );
}

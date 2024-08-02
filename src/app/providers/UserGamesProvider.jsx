'use client';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import userGameService from '@/services/userGameService';

export const UserGamesContext = createContext();

export default function UserGamesProvider({ children }) {
  const [userGames, setUserGames] = useState([]);
  const [userGamesOnBoard, setUserGamesOnBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userGameService.getUserGames();
      console.log('fetchUserGames response -----> ', response);
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

  useEffect(() => {
    fetchUserGames();
    fetchGamesOnBoard();
  }, [fetchUserGames, fetchGamesOnBoard]);

  return (
    <UserGamesContext.Provider
      value={{
        loading,
        userGames,
        setUserGames,
        fetchUserGames,
        userGamesOnBoard,
        setUserGamesOnBoard,
        fetchGamesOnBoard,
        updateUserGameData,
        updateUserGameColumnPositions,
      }}
    >
      {children}
    </UserGamesContext.Provider>
  );
}

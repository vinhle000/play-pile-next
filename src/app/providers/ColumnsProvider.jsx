'use client';
import React, { useState, useEffect, useCallback, createContext } from 'react';
import columnService from '@/services/column-service';

export const ColumnsContext = createContext({});


export default function ColumnsProvider({ children }) {
  const [columns, setColumns] = useState([]);
  const [columnsOnBoard, setColumnsOnBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColumns = useCallback(async () => {
    try {
      setLoading(true);
      const columns = await columnService.getColumns();
      setColumns(columns);
      return columns;
    } catch (error) {
      console.error('Error fetching user play pile', error);
      setLoading(false);
    }
  }, []);

  const fetchColumnsOnBoard = useCallback(async () => {
    try {
      setLoading(true);
      const columnsOnBoard = await columnService.getColumnsOnBoard();
      setColumnsOnBoard(columnsOnBoard);
      return columnsOnBoard;
    } catch (error) {
      console.error(`Error fetching user play pile`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createColumn = useCallback(
    async (title) => {
      try {
        setLoading(true);
        await columnService.createColumn(title);
        fetchColumnsOnBoard();
      } catch (error) {
        console.error('Error creating column', error);
      } finally {
        setLoading(false);
      }
    },
    [fetchColumnsOnBoard],
  );

  const updateColumn = async (columnId, updateData) => {
    try {
      await columnService.updateColumn(columnId, updateData);
      fetchColumns();
    } catch (error) {
      console.error('Error updating column', error);
    }
  };

  const deleteColumn = useCallback(
    async (columnId) => {
      try {
        setLoading(true);
        await columnService.deleteColumn(columnId);
        //optimistic update for UI responsiveness
        setColumnsOnBoard(
          columnsOnBoard.filter((column) => column._id !== columnId),
        );
      } catch (error) {
        console.error('Error deleting column', error);
      } finally {
        setLoading(false);
      }
    },
    [columnsOnBoard],
  );

  useEffect(() => {
    fetchColumns();
    fetchColumnsOnBoard();
  }, [fetchColumns, fetchColumnsOnBoard]);

  return (
    <ColumnsContext.Provider
      value={{
        loading,
        columns,
        setColumns,
        fetchColumns,
        createColumn,
        updateColumn,
        deleteColumn,
        columnsOnBoard,
        setColumnsOnBoard,
        fetchColumnsOnBoard,
      }}
    >
      {children}
    </ColumnsContext.Provider>
  );
}
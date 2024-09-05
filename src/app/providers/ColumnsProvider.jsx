'use client';
import React, { useState, useCallback, createContext } from 'react';
import columnService from '@/services/column-service';

export const ColumnsContext = createContext({});

export default function ColumnsProvider({
  children,
  initialColumns,
  initialColumnsOnBoard,
}) {
  const [columns, setColumns] = useState(initialColumns);
  const [columnsOnBoard, setColumnsOnBoard] = useState(initialColumnsOnBoard);
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

  const updateColumn = useCallback(
    async (columnId, updateData) => {
      try {
        await columnService.updateColumn(columnId, updateData);
        fetchColumns();
      } catch (error) {
        console.error('Error updating column', error);
      }
    },
    [fetchColumns],
  );

  const updateColumnPositions = useCallback(
    async (columns) => {
      try {
        setLoading(true);
        await columnService.updateColumnPositions(columns);
        fetchColumns();
        fetchColumnsOnBoard();
      } catch (error) {
        console.error('Error updating column positions', error);
      } finally {
        setLoading(false);
      }
    },
    [fetchColumns, fetchColumnsOnBoard],
  );

  const deleteColumn = useCallback(async (columnId) => {
    try {
      setLoading(true);
      await columnService.deleteColumn(columnId);
      //optimistic update for UI responsiveness
      setColumnsOnBoard((prev) =>
        prev.filter((column) => column._id !== columnId),
      );
    } catch (error) {
      console.error('Error deleting column', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        updateColumnPositions,
      }}
    >
      {children}
    </ColumnsContext.Provider>
  );
}

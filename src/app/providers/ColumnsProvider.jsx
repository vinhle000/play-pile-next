'use client';
import React, { useState, useEffect, useCallback, createContext } from 'react';
import useSWR, { mutate, SWRConfig } from 'swr';
import columnService from '@/services/column-service';

export const ColumnsContext = createContext({});

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ColumnsProvider({ children, initialColumns, initialColumnsOnBoard }) {
  const [loading, setLoading] = useState(true);

  const {
    data: columns,
    error: columnsError,
    isLoading: columnsIsLoading,
  } = useSWR('/api/board/columns', columnService.getColumns);

  const {
    data: columnsOnBoard,
    error: columnsOnBoardError,
    isLoading: columnsOnBoardIsLoading,
  } = useSWR('/api/board/columns/on-board', columnService.getColumnsOnBoard,);

  const createColumn = useCallback(async (title) => {
    try {
      setLoading(true)
      await columnService.createColumn(title);
      mutate('/api/board/columns/on-board');
    } catch (error) {
      console.error('Error creating column');
    } finally {
      setLoading(false)
    }
  }, []);

  const updateColumn = async (columnId, updatedFields) => {
    try {
      setLoading(true);
      await columnService.updateColumn(columnId, updatedFields);
      // fetchColumns();
      mutate('/api/board/columns/'); // if we need to fetch all columns
      mutate('/api/board/columns/on-board');
    } catch (error) {
      console.error('Error updating column', error);
    } finally {
      setLoading(false);
    }
  };


  const updateColumnPositions = async (columnsWithNewPositions) => {
    try {
      setLoading(true);
      // set columsn optimistaclaly
      mutate('/api/board/columns/on-board', columnsWithNewPositions, false)
      await useColumnService.updateColumnPositions(columnsWithNewPositions.map((column) => ({ _id: column._id }))); //

      mutate('/api/board/columns/'); // if we need to fetch all columns
      mutate('/api/board/columns/on-board');
    } catch (error) {
      console.error('Error updating column', error);
      mutate('/api/board/columns/'); // ROLL BACK
      mutate('/api/board/columns/on-board');
    } finally {
      setLoading(false);
    }
  };


  const deleteColumn = useCallback(async (columnId) => {
    try {
      setLoading(true);

      mutate(
        '/api/board/columns/',
        () => columnsOnBoard.filter((column) => column._id !== columnId),
        false,
      );

      await useColumnService.deleteColumn(columnId);
      mutate('/api/board/columns/'); // if we need to fetch all columns
      mutate('/api/board/columns/on-board');
    } catch (error) {
      console.error('Error deleting column', error);
      mutate('/api/board/columns/'); // rollback both
      mutate('/api/board/columns/on-board');
    } finally {
      setLoading(false);
    }
  });

  return (
    <SWRConfig value={{
      fallback: {
        '/api/board/columns': initialColumns,
        '/api/board/columns/on-board': initialColumnsOnBoard
      }
      }
    }>
    <ColumnsContext.Provider
      value={{
        loading,
        columns,
        columnsError,
        columnsIsLoading,
        columnsOnBoard,
        columnsOnBoardError,
        columnsOnBoardIsLoading,

        // loading,
        // columns,
        // setColumns,
        // fetchColumns,
        createColumn,
        updateColumn,
        deleteColumn,
        // columnsOnBoard,
        // setColumnsOnBoard,
        // fetchColumnsOnBoard,
      }}
    >
      {children}
    </ColumnsContext.Provider>
  </SWRConfig>
  );
}

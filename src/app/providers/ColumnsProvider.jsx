'use client';
import React, { useState, useEffect, useCallback, createContext } from 'react';
import useSWR, { mutate } from 'swr';
import columnService from '@/services/column-service';

export const ColumnsContext = createContext({});

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ColumnsProvider({ children }) {
  // const [columns, setColumns] = useState([]);
  // const [columnsOnBoard, setColumnsOnBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fetchColumns = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const columns = await useColumnService.getColumns();
  //     setColumns(columns);
  //     return columns;
  //   } catch (error) {
  //     console.error('Error fetching user play pile', error);
  //     setLoading(false);
  //   }
  // }, []);

  // const fetchColumnsOnBoard = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const columnsOnBoard = await useColumnService.getColumnsOnBoard();
  //     setColumnsOnBoard(columnsOnBoard);
  //     return columnsOnBoard;
  //   } catch (error) {
  //     console.error(`Error fetching user play pile`, error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
  const {
    data: columns,
    error: columnsError,
    loading: columnsLoading,
  } = useSWR('/api/board/columns', columnService.getColumns);
  const {
    data: columnsOnBoard,
    error: columnsOnBoardError,
    loading: columnsOnBoardLoading,
  } = useSWR('/api/board/columns/on-board', columnService.getColumnsOnBoard);

  const createColumn = useCallback(async (title) => {
    try {
      //No optimistic update
      setLoading(true)
      await columnService.createColumn(title);
      // mutate('/api/board/columns/') // if we need to fetch all columns
      mutate('/api/board/columns/on-board');
    } catch (error) {
      console.error('Error creating column');

      // rollback changews
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


  /*
{
	"columns":
	[
		{
			"_id": "6632bdb73c16959712a41345",
			"position": 0
		},
		{
			"_id": "6632bdb23c16959712a41341",
			"position": 1
		},
		{
			"_id": "6632bdbb3c16959712a41349",
			"position": 2
		}
	]
}


  */
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
    <ColumnsContext.Provider
      value={{
        loading: loading || columnsLoading || columnsOnBoardLoading,
        columns,
        columnsOnBoard,
        columnsOnBoardError,
        // columnsOnBoardLoading,

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
  );
}

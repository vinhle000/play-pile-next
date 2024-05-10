import {useState, useEffect, createContext} from 'react'
import columnService from '@/services/columnService'

const ColumnsContext = createContext({})

export const ColumnsProvider = ({children}) => {
  const [columns, setColumns] = useState([]);
  const [columnsOnBoard, setColumnsOnBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColumns = async () => {
    try {
      setLoading(true);
      const columns = await columnService.getColumns();
      setColumns(columns);
      return columns;

    } catch (error) {
      console.error('Error fetching user play pile', error)
      setLoading(false)
    }
  }

  const fetchColumnsOnBoard = async () => {
    try {
      setLoading(true)
      const columns = await columnService.getColumnsOnBoard();

      console.log(`ColumnContext.jsx -> columns on board --> `, columns )
      setColumnsOnBoard(columns);
      return columns;

    } catch (error) {
      console.error(`Error fetching user play pile`, error)
    } finally {
      setLoading(false)
    }
  }

  const updateColumn = async (columnId, updateData) => {
    try {
      await columnService.updateColumn(columnId, updateData);
      fetchColumns();
    } catch (error) {
      console.error('Error updating column', error)
    }
  }

  const deleteColumn = async (columnId) => {

    //FIXME: Working, but need to refresh page to see changes.
    // Could be this context not updating realtime?
    try {
      setLoading(true)
      await columnService.deleteColumn(columnId);
    } catch (error) {
      console.error('Error deleting column', error)
    } finally {
      fetchColumns()
      setLoading(false);
    }
  }



  useEffect(() => {
    fetchColumns();
  }, [])

  return (
    <ColumnsContext.Provider
    value={{
      loading,
      columns,
      setColumns,
      fetchColumns,
      updateColumn,
      deleteColumn,
      columnsOnBoard,
      setColumnsOnBoard,
      fetchColumnsOnBoard,
      }}>
      {children}
    </ColumnsContext.Provider>
  )
}

export default ColumnsContext;
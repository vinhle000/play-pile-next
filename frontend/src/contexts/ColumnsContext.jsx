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
      columnsOnBoard,
      setColumnsOnBoard,
      fetchColumnsOnBoard,
      }}>
      {children}
    </ColumnsContext.Provider>
  )
}

export default ColumnsContext;
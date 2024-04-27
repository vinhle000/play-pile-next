import {useState, useEffect, createContext} from 'react'
import columnService from '@/services/columnService'

const ColumnsContext = createContext({})

export const ColumnsProvider = ({children}) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColumns = async () => {
    try {
      setLoading(true);
      const response = await columnService.getColumns();
      setColumns(response);
      console.log('Columns fetched: ', response)
      return response.data;

    } catch (error) {
      console.error('Error fetching user play pile', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchColumns();
  }, [])

  return (
    <ColumnsContext.Provider value={{columns, setColumns, loading, fetchColumns}}>
      {children}
    </ColumnsContext.Provider>
  )
}

export default ColumnsContext;
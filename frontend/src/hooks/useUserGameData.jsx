import React, { useState, useMemo, useCallback} from 'react'

export default function useUserGameData(initialState) {
  const [userGameData, _setUserGameData] = useState(initialState);

  const setUserGameData = useCallback((newData) =>
    _setUserGameData((prevData) => {
      return {
        ...prevData,
        ...newData,
      }
    }), []);

  const memoizedUserGameData = useMemo(() => userGameData, [userGameData])
  return ( [memoizedUserGameData, setUserGameData])
}


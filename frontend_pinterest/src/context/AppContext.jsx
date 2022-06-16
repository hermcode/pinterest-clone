import React, { createContext } from 'react'
import { useState } from 'react'

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

  const [ userInfo, setUserInfo ] = useState(null)
  const [ userData, setUserData ] = useState(null)

  return (
    <AppContext.Provider value={{userInfo, setUserInfo, userData, setUserData}}>
      { children }
    </AppContext.Provider>
  )
}

export default AppContext
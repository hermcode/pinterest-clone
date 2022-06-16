import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './containers/Home';
import useVerifyIfUserExist from './hooks/useVerifyIfUserExist';

const App = () => {
  
  useVerifyIfUserExist()

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  )
}

export default App
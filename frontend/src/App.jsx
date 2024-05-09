import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import BoardPage from './pages/BoardPage'

import { UserProvider } from './contexts/UserContext'
import { UserPlayPileGamesProvider } from './contexts/UserPlayPileGamesContext'
import { ColumnsProvider } from './contexts/ColumnsContext'


function App() {

  return (
    <div>
      <UserProvider>
      <UserPlayPileGamesProvider>
      <ColumnsProvider>
          <Router>
            <NavigationBar/>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/games/search" element={<SearchPage />} />
              <Route path="/board" element={<BoardPage />} />
            </Routes>
          </Router>
      </ColumnsProvider>
      </UserPlayPileGamesProvider>
      </UserProvider>
    </div>
  );
}

export default App
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import BacklogPage from './pages/BacklogPage'

import { UserProvider } from './contexts/UserContext'
function App() {


  return (
    <div>
      <UserProvider>
        <Router>
          <NavigationBar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/games/search" element={<SearchPage />} />
            <Route path="/backlog" element={<BacklogPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App
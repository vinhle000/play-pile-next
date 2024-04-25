import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import PlayPileBoardPage from './pages/PlayPileBoardPage'

import { UserProvider } from './contexts/UserContext'
import { UserPlayPileGamesProvider } from './contexts/UserPlayPileGamesContext'

import PlayPileList from './components/PlayPileList'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'



function App() {
const [isPlayPilePanelOpen, setIsPlayPilePanelOpen] = useState(false)

  return (
    <div>
      <UserProvider>
      <UserPlayPileGamesProvider>
          <Router>
            <Sheet open={isPlayPilePanelOpen} onOpenChange={setIsPlayPilePanelOpen}>

              <SheetTrigger className="fixed top-0 left-0 z-10 p-4">
                <span>
                  {isPlayPilePanelOpen ? '←'  : '→' }
                </span>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="min-h-screen min-w-128 p-4 shadow-none transition-all duration-300 ease-in-out">
                <PlayPileList />
              </SheetContent>

            </Sheet>
            <NavigationBar/>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/games/search" element={<SearchPage />} />
              <Route path="/playPileBoard" element={<PlayPileBoardPage />} />
            </Routes>
          </Router>
      </UserPlayPileGamesProvider>
      </UserProvider>
    </div>
  );
}

export default App
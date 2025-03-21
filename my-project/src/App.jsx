import { useState } from 'react'
import NavBar from './components/NavBar'
import useThemeStore from './store/useThemeStore'
import MainContent from './components/MainComponents'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './components/SignIn'
import Login from './components/Login'
import {  SignInButton, UserButton } from '@clerk/clerk-react'
import FaQ from './components/FaQ'

function App() {
  const { theme } = useThemeStore()

  return (
    <BrowserRouter>
      <div data-theme={theme} className='h-[100vh] w-full '>
        <NavBar />
      
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faqs" element={<FaQ />} />
    
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

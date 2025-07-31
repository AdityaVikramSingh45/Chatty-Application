import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import {Routes, Route, Navigate} from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
// import SettingPage from "./pages/SettingPage"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"

const App = () => {  
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  
  useEffect(()=>{
    checkAuth();
  }, [])

  console.log("onlineUsers", {onlineUsers});

  if(!authUser && isCheckingAuth)return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )


  // console.log("authUser", authUser);
 
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage/> : <Navigate to = "/login"/>} />
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to = "/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to = "/"/>} />
        {/* <Route path="/settings" element={<SettingsPage/>} /> */}
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to = "/login"/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
import { useState } from 'react'
import './App.css'
import Login from './Components/Login';
import UserContext from './context/UserContext';
import Dashboard from './Components/Dashboard';
import SocketProvider from './Components/SocketProvider'

function App() {
  const [isAuthenticated, setAuthentication] = useState(()=>{
    const savedToken = localStorage.getItem('token');
    return savedToken && savedToken != 'undefined';
  });

  const [user, setUser] = useState(()=>{
    const savedUser = localStorage.getItem('user');
    return savedUser && savedUser != 'undefined' ? JSON.parse(savedUser) : null;
  })

  const logout = ()=>{
    setAuthentication(false);
    localStorage.removeItem('user');
    setUser(null);
    localStorage.removeItem('token');
  }
  
  return (isAuthenticated ?
    <UserContext.Provider value={{user, logout}}>
      <SocketProvider>
        <Dashboard />
      </SocketProvider>
    </UserContext.Provider>
    :
    <>
      <Login onLoginSuccess={()=>{
        setAuthentication(true);
        const user = localStorage.getItem('user');
        setUser(user && user !== 'undefined' ? JSON.parse(user) : null);
        }}/>
    </>
  )
}

export default App

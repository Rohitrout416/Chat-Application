import { useState } from 'react'
import './App.css'
import Login from './Components/Login';
import UserContext from './context/UserContext';
function App() {
  const [isAuthenticated, setAuthentication] = useState(()=>{
    const savedToken = localStorage.getItem('token');
    return savedToken && savedToken != 'undefined';
  });
  return (isAuthenticated ?
    <UserContext.Provider value={}></UserContext.Provider>
      Chat Dashboard
    </>
    :
    <>
      <Login onLoginSuccess={()=>setAuthentication(true)}/>
    </>
  )
}

export default App

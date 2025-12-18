import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import SocketContext from "../context/SocketContext"

export default function SocketProvider({ children }: {children:React.ReactNode}){
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(()=>{
        const newSocket = io('http://localhost:3000', {auth:{token: localStorage.getItem('token')}});
        setSocket(newSocket);
     
        return ()=> { newSocket?.disconnect() }
    },[])
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}
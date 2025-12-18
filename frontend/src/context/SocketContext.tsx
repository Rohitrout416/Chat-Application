import { createContext } from "react";
import { type Socket } from "socket.io-client"

interface SocketContextType{
    socket: Socket | null
}

const SocketContext = createContext<SocketContextType | null>(null) 

export default SocketContext
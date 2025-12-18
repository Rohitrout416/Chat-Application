import { createContext } from "react"

interface User{
    _id: number,
    userName: string
}

interface userContextType{
    user: User | null,
    logout: () => void
}

const UserContext = createContext<userContextType>({user: null, logout: () => {}});

export default UserContext;
import { createContext } from "react"

interface User{
    _id: number,
    userName: string
}

const UserContext = createContext<User | null>(null);

export default UserContext;
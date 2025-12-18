import { useContext } from "react"
import UserContext from "../context/UserContext"

export default function Sidebar(){
    const { logout } = useContext(UserContext);
    return(
        <>
        <button onClick={logout} >Logout</button>
        </>
    )
}
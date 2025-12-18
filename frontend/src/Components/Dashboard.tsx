import { useContext } from "react"
import UserContext from "../context/UserContext"
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

export default function Dashboard(){
    const user = useContext(UserContext);
    console.log(user);
    return(
        <div className="dashboard">
        <Sidebar />
        <ChatArea />
        </div>
    )
}
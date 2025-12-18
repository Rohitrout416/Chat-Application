import { useState } from "react";
import axios from 'axios';

interface LoginProps {
    onLoginSuccess(): void
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [isLoginMode, setLoginMode] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { userName: userName, password };
        try {
            if (!isLoginMode) {
                const result = await axios.post("http://localhost:3000/users/signup", payload);
                console.log(result)
                if (result.status === 201) {
                    alert("User Created!");
                    setLoginMode(true);
                }
                else {
                    console.log("Signup Failed");
                }
            }
            else{
                const result = await axios.post("http://localhost:3000/users/login", payload);
                console.log(result)
                
                const result1: any = await axios.get(`http://localhost:3000/users/${userName}`);
                const {_id} = result1.data;
                const user = {_id, userName};
                localStorage.setItem('user', JSON.stringify(user));
                
                if(result.status==200){
                    const token = result.data.token;
                    localStorage.setItem('token', token);
                    onLoginSuccess();
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" id="username" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/>
            <input type="password" name="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <button>{isLoginMode ? "Login" : "Signup"}</button>
            <p style={{color: "lightblue", cursor: "pointer"}} onClick={()=>setLoginMode(!isLoginMode)}>{isLoginMode ? "Switch to Sign Up" : "Switch to Login"}</p>
        </form>
    )
}
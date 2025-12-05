import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const signup = async(req, res)=>{
    const {userName, password} = req.body
    if(!userName || !password) return res.status(400).json("Plz enter Username or Password correctly!!");

    try{
        const exists = await User.findOne({userName});
        if (exists){ return res.status(400).json({error:"User already created!"})}
        else{
            const hashPassword = await bcrypt.hash(password, 10);
            await User.create({userName: userName, password: hashPassword});
            
            return res.status(201).json({success: "User successfully created!"});
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({err});
    }
}


export const login = async(req, res)=>{
    const {userName, password} = req.body;
    if(!userName || !password){
        return res.status(400).send("Please enter username or password correctly!!");
    }
    
    try{
        const exists = await User.findOne({userName})
        if(!exists){
            return res.status(404).json("User doesnt exist. Please signup")
        }
        const isValid = await bcrypt.compare(password, exists.password);
        if(isValid){
            const payload = {id:exists._id, userName};
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1Hr' });
            return res.status(200).json({
                success: true,
                token
            })
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json(err);
    }
}

export const authenticateToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if( token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if (err){
            if(err.name === "TokenExpiredError"){
                return res.status(401).json("Token Expired. Please Log in again!!")
            }
            return res.status(403).json("Invalid Token");
        } 
        req.user = user
        next()
    });
}
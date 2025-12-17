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

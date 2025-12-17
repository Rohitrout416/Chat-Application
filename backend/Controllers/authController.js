import jwt from 'jsonwebtoken';

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
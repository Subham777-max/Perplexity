import jwt from "jsonwebtoken";
export async function authUser(req,res,next){
    try{
        const token = req.cookies.token;
        if(!token){
            const err = new Error("Unauthorized");
            err.status = 401;
            return next(err);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        err.status = 401;
        err.message = "Invalid token";
        return next(err);
    }
}

export function verifyToken(token){
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }catch(err){
        throw new Error("Invalid token");
    }
}
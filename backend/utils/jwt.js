import jwt from 'jsonwebtoken'
import AppError from './appError.js'
import dotenv from 'dotenv'
dotenv.config()
const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN || '1d',

    })
}

const verifyToken = async (token)=>{
    try {
        const decoded =  jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        return decoded;
    }catch(err){
        throw new AppError('Invalid token. Please log in again!',401)
    }
}

const decodeToken = (token)=>{
    return jwt.decode(token)
}

export {signToken,verifyToken,decodeToken}
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

import { sendCookies } from "../utils/feature.js";
import ErrorHandler from "../middlewares/error.js";


export const getAllUser = async(req,res,next)=>{

    try {
    const {email} = req.body;

    const users = await User.find(email);

    res.status(200).json({
        success : true,
        users
    })
    } catch (error) {
        next(error)        
    }

}


export const login = async(req,res,next)=>{

    try {
    const {email,password} = req.body;

    const user = await User.findOne({ email }).select("+password");

    if(!user) return next(new ErrorHandler("Invalid Email or Password",400));
    

    const isMatch =await bcrypt.compare(password, user.password);

    if(!isMatch) 
    return next(new ErrorHandler("Invalid Email or Password",400));
    
    sendCookies(user,res,`Welcome back, ${user.name}`,200);
    } catch (error) {
       next(error) 
    }

}

export const register = async(req,res,next)=>{

    try {
    const {name,email,password}= req.body;

    let user = await User.findOne({ email});

    if (user) return next(new ErrorHandler("User Already Exist", 400));
    
    const hashedPassword = await bcrypt.hash(password,10);

     user = await User.create({
        name,
        email,
        password : hashedPassword
    });

    sendCookies(user,res,"Registered Successfully",201);
    } catch (error) {
        next(error)
    }
    
}



export const getMyProfile =(req,res)=>{

    res.status(200).json({
        success : true,
        user : req.user,
    })

}


export const logout =(req,res)=>{
    res.status(200).cookie("token" , "" ,{
        expires : new Date(Date.now()),
        sameSite : process.env.NODE_ENV==="Development"? "lax" :"none",
        secure : process.env.NODE_ENV==="Development"? false : true,
    }).json({
        success : true,
        user : req.user,
        message : "Logout Successfully",
    })
}


















// export const special = (req,res)=>{
//     res.json({
//         success :true,
//         message : 'Special'
//     })
// }

// export const updateUser = async(req,res)=>{
//     const {id} = req.params;
//    const user = await User.findById(id);
//     res.json({
//         success :true,
//         message : "Updated",
//     })
// }
// export const deleteUser = async(req,res)=>{
//     const {id} = req.params;
//    const user = await User.findById(id);

//     await User.findById(id).deleteOne(user);
//     res.json({
//         success :true,
//         message : "Deleted",
//     })
// }
import User from "../model/user.model.js";
import {z} from "zod"
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";
import { id } from "zod/v4/locales";

const userSchema=z.object({
    email:z.string().email({message:"Invalid email address"}),
    username:z.string().min(3,{message:"USername most be atleast 3 cahracters"}),
        password:z.string().min(6,{message:"Password most be atleast 6 characters Long "}),
})




export const register=async(req,res)=>{
   try {
    const {email,username,password}= req.body;
    //console.log(email,username,password);
    if (!email || !username || !password){
                return res.status(400).json({message:"All fields are required"})

    }
const validation= userSchema.safeParse({email,username,password})

if(!validation.success){
    //   return res.status(400).json({errors: validation.error.errors});
const errorMessage = validation.error.issues.map((err) => err.message);
return res.status(400).json({errors:errorMessage});
}

    const user= await User.findOne({email})
    if(user){
        return res.status(400).json({message:"user already registered"})

    }
    const hashPassword=await bcrypt.hash(password,10)
    const newUser = new User({email,username,password:hashPassword});
    await newUser.save()
    if (newUser){
const token=await generateTokenAndSaveInCookies(newUser._id,res);

        res.status(201).json({message:"user registered sucessfully",newUser,token})
    }
   } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error registering user"})
    
   }
};
export const login=async(req,res)=>{
    const{email,password}=req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"ALl Fields Are Required"})
        }
        const user=await User.findOne({email}).select("+password")
         if(!user||!(await bcrypt.compare(password,user.password))){
 res.status(400).json({message:"Invalid email or password"})
         }
         const token=await generateTokenAndSaveInCookies(user._id,res);
          res.status(200).json({message:"User Loged in Sucessfully ",user,token})
    } catch (error) {
        console.log(error);
            res.status(500).json({message:"Error LOging in "})
    }
    }

export const logout=(req,res)=>{
    try {
        res.clearCookie("jwt",{
            path:"/",
        })
         res.status(200).json({message:"User Logout "})
    } catch (error) {
         console.log(error);
            res.status(500).json({message:"Error LOging out "})
    }
};

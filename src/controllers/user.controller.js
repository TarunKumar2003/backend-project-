
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "./user.controller.js";
export {uploadOnCloudinary} from "../utils/cloudinary.js"
export {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res)=>{
     // destructure the data using {} curly parenthesis
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
     const {fullName, email, username, password } = req.body
     console.log("email :", email)
     // Validation
     if(
        [fullName, email, username, password].some((field)=>
        field?.trim()==="")
     ){
        throw new ApiError(400,"All fields are Compulsory");
     }

      // Check if User is Already exist or not 
        const existedUser =  User.findOne({
            $or:[{ username },{ email }]
         })
         if(existedUser){
            throw new ApiError(409,"user is Already existed");
         }
      // 
    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath =  req.files?.coverImage[0].path;

    if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is Required");
    }

    // Upload them to cloudinary 
   const avatar =  await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new ApiError(400,"Avatar file is Required");
   }
    // create a object and entry into the database
      const user = await User.create({
         fullName,
         avatar:avatar.url,
         coverImage:coverImage?.url || "",
         email,
         password,
         username:username.toLowerCase()
      })
     const createdUser = await User.findById(user._id).select(
         "-password -refreshToken"
      )
      if(!createdUser){
         throw new ApiError(500,"Something went wrong registering the user");
      }
   // return response user to the User
      return res.status(201).json(
         new ApiResponse(200,createdUser,"User registered Successfully")
      )
   }) 

export {registerUser}
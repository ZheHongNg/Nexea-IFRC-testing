// const User = require("../models/UserSchema");
// const jwt =require ('jsonwebtoken')

// const isAuthenticated = async (req, res, next)=>{
//     try{
//         const token = req.cookies.token
//         if (!token){
//             return next ("Please login to the website")
//         }
//         const verify = await jwt.verify(token, process.env.SECRET_KEY)
//         req.user = await User.findOne(verify.email)
//         next()
//     }catch(err){
//         return next(err)
//     }
// }

// module.exports = isAuthenticated
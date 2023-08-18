const User = require("../models/UserSchema");

const getUser = async (req, res) =>{
    try{
        const user = await User.find()
        if (!user){
            return res.json({message : "No user found"})
        }
        return res.json ({user : user})
    }catch(error){
        return res.json({error : error})
    }
} 

module.exports = {getUser}
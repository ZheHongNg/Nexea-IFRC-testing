const jwt = require('jsonwebtoken')
const config = require('../config/auth-config')
const db = require('../model')
const User = db.user
const Role = db.role

verifyToken = (res, req, next)=>{
    let token = req.headers['x-access-token']

    if (!token){
        return res.status(403).send({message:"No token found"})
    }

    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err){
            return res.status(401).send({message:"Unauthorized"})
        }
        req.userId = decoded
        next()
    })
}

isAdmin = (req, res, next)=>{
    User.findById(req.userId).exec((err, user)=>{
        if(err){
            return res.status(500).send({message:err})
        }
        Role.find(
            {
                id:{$in:user.roles}
            },
            (err, roles)=>{
                if (err){
                    return res.status(500).send({message:err})
                }
                for (let i =0; i<roles.length; i++){
                    if(roles[i].name === "admin"){
                        next()
                        return;
                    }
                }
                return res.status(403).send({message:"Require admin role"})
            }
        )
    })
}

isSuperAdmin = (req, res, next)=>{
    User.findById(req.userId).exec((err, user)=>{
        if(err){
            return res.status(500).send({message:err})
        }
        Role.find(
            {
                id:{$in:user.roles}
            },
            (err, roles)=>{
                if (err){
                    return res.status(500).send({message:err})
                }
                for (let i =0; i<roles.length; i++){
                    if(roles[i].name === "super-admin"){
                        next()
                        return;
                    }
                }
                return res.status(403).send({message:"Require super admin role"})
            }
        )
    })
}

let authJWT = { verifyToken, isAdmin, isSuperAdmin}
module.exports = authJWT
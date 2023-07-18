const config = require('../config/auth-config')
const nodemailer = require('../config/nodemailer-config')
const db = require('../model')
const User = db.user
const Role = db.role
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    const token = jwt.sign({ email: req.body.email }, config.secret);


    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber,
        department: req.body.department,
        confirmationCode: token
    })

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return;
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles)=>{
                    if (err){
                        res.status(500).send({message: err})
                        return;
                    }

                    user.roles = roles.map((role)=>role.id)
                    user.save((err)=>{
                        if (err){
                            res.status(500).send({message:err})
                            return;
                        }
                        res.send({
                            message: "User was registered successfully! Go to your email to activate account!",
                        });
                        nodemailer.sendConfirmationEmail(
                            user.fname,
                            user.lname,
                            user.email,
                            user.confirmationCode
                        )
                        res.redirect("/login");
                    })
                }
            )
        }else{
            Role.findOne({name : "user"},(err,role)=>{
                if(err){
                    res.status(500).send({message:err})
                    return;
                }
                user.roles = [role.id]
                user.save((err)=>{
                    if(err){
                        res.status(500).send({message:err})
                        return
                    }
                    res.send({
                        message: "User was registered successfully! Go to your email to activate account!"
                    })

                    nodemailer.sendConfirmationEmail(
                        user.fname,
                        user.lname,
                        user.email,
                        user.confirmationCode
                    )
                })
            })
        }
    })
}

exports.login = (req, res)=>{
    User.findOne({
        email : req.body.email
    })
    .populate("roles", "-__v")
    .exec((err, user)=>{
        if(err){
            res.status(500).send({message:err})
            return    
        }
        if(!user){
            return res.status(404).send({message:"User not found"})
        }

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

        if(!passwordIsValid){
            return res.status(404).send({message:"Incorrect Password", accessToken : null})
        }
        if(user.status!= "Active"){
            return res.status(401).send({message:"Please verify your account!"})
        }
        let token = jwt.sign({id: user.id}, config.secret)
        let authorities = [];

        for (let i = 0; i< user.roles.length; i++){
            authorities.push("ROLE_"+user.roles[i].name.toUpperCase())
        }

        return res.status(200).send({
            id: user.id,
            email: user.email,
            status: user.status,
            accessToken : token
        })
    })
}

exports.verifyUser = (req, res, next) =>{
    User.findOne({
        confirmationCode : req.params.confirmationCode
    })
    .then((user)=>{
        console.log(user)
        if (!user){
            return res.status(404).send({message:"User not found"})
        }
        user.status = "Active"
        user.save((err)=>{
            if(err){
                return res.status(500).send({message:err})
            }
        })
    })
    .cache((e)=>console.log("error",e))
}
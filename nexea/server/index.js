const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const User = require('./model/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('./config/auth-config')
app.use(cors())
app.use(express.json())
require('dotenv').config()


// const connection = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log("Database is connected");
//     } catch (error) {
//         console.log(error);
//     }
// };

// module.exports = connection;
mongoose.connect(process.env.MONGO_URL);

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    
    try {
        const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
        const token = jwt.sign(
            {
                email: req.body.email
            },
            config.secret
        )
        
        await User.create({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phoneNumber,
            department: req.body.department,
            confirmationCode : token
        })
        res.json({ status: 'OK' })
        nodemailer.sendConfirmationEmail(
            req.body.fname,
            req.body.lname,
            req.body.email,
            req.body.confirmationCode
        )
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})

app.post('/api/login', async (req, res) => {
    console.log(req.body)

    const user = await User.findOne({
        email: req.body.email,
    })
    
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if (isPasswordValid && user) {
        const token = jwt.sign(
            {
                email: user.email
            },
            config.secret
        )
        if (user.status!="Active"){
            return res.status('error').send({
                message: "Pending account. Please verify your email",
            })
        }else{
            return res.json({ status: 'ok', user: token })
        }
        
    } else {
        return res.json({ status: 'error', user: false })
    }
})

app.get('/api/confirm/:confirmationCode', async (req, res)=>{
    User.findOne({
        confirmationCode: req.params.confirmationCode
    }).then((user)=>{
        if (!user){
            return res.json({ status: 'error', error: "User not found" })
        }
        user.status = 'Active';
        user.save((err)=>{
            if (err){
                return res.json({ status: 'error', error: err })
            }
        })
    })
})

app.listen(1337, () => {
    console.log('server start on 1337')
})
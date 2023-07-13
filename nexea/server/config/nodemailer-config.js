const nodemailer = require('nodemailer')
const config = require('../config/auth-config')
require ('dotenv').config()

const user = config.email_user
const password = config.email_password

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user : user,
        password : password
    },
})

module.exports.sendConfirmationEmail= (fname, lname, email, confirmationCode)=>{
    transport.sendMail({
        form: user,
        to: email,
        subject : 'Account verification',
        html:`<h1>Account Verification</h1>
            <h2>Hello ${fname, lname}</h2>
            <p>You are registered as IFRC employee. Please confirm your email to identify you as a valid employee by clicking on the floowing link.</p>
            <a href=http://localhost:8081/confirm/${confirmationCode}>Clcick here</a>`,
    }).catch(err=>console.log(err))
}

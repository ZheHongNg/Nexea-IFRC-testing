const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const User = require('./model/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('./config/auth-config')
const connection = require('./config/connection')
const bodyParser = require('body-parser')
const db = require('./model')
const Role = db.role

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
require('dotenv').config()

connection();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });

require('./routes/auth-routes')(app);
require('./routes/user-routes')(app);

function initial(){
    Role.estimatedDocumentCount((err, count)=>{
        if (!err && count === 0){
            new Role({
                name:'user'
            }).save(err=>{
              if (err){
                console.log('error', err)
              }
              console.log('added user to collection')  
            })
            new Role({
                name:'admin'
            }).save(err=>{
              if (err){
                console.log('error', err)
              }
              console.log('added admin to collection')  
            })
            new Role({
                name:'super-admin'
            }).save(err=>{
              if (err){
                console.log('error', err)
              }
              console.log('added super admin to collection')  
            })
        }
    })
}

app.listen(1337, () => {
    console.log('server start on 1337')
})
const jwt = require('jsonwebtoken')
const config = require('../config/auth-config')
const db = require('../model')
const user = db.user
const role = db.role

verifyToken = (res, req, next)=>{

}
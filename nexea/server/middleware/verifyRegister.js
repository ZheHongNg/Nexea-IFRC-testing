const db = require('../model')
const User = db.user
const Role = db.ROLES

checkEmail = (req, res) =>{
    User.findOne(
        {email: req.body.email}
    ).exec((err, user)=>{
        if (err){
            return res.status(500).send({message:err})
        }
        if (user){
            return res.status(400).send({message:'Duplicated email'})
        }
        next()
    })
}

checkRoles = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!Role.includes(req.body.roles[i])) {
          res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }
  
    next();
  };
  

let verifyRegister = {checkEmail, checkRoles}
module.exports = verifyRegister
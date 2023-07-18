const {verifyRegister} = require ('../middleware')
const auth_controller = require('../controller/auth-controller')

module.exports = function(app){
    app.use((req, res, next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, ContentType, Accept"
        )
        next()
    })
    app.post(
        "/api/register",
        [
            verifyRegister.checkEmail,
            verifyRegister.checkRoles
        ],
        auth_controller.register
    )

    app.post("api/login", auth_controller.login)

    app.get("/api/confirm/:confirmationCode", auth_controller.verifyUser)
}
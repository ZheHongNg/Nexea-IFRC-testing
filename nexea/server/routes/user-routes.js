const {authJWT} = require ('../middleware')
const user_controller = require('../controller/user-controller')

module.exports = function(app){
    app.use((req, res, next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, ContentType, Accept"
        )
        next()
    })

    app.get("/api/user", [authJWT.verifyToken], user_controller.userPage)
    app.get("/api/admin", [authJWT.verifyToken, authJWT.isAdmin], user_controller.adminPage)
    app.get("/api/superadmin", [authJWT.verifyToken, authJWT.isSuperAdmin], user_controller.superAdminPage)
}
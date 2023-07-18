exports.userPage = (req, res) =>{
    res.status(200).send("user content")
}

exports.adminPage = (req, res) =>{
    res.status(200).send("admin content")
}

exports.superAdminPage = (req, res) =>{
    res.status(200).send("super admin content")
}
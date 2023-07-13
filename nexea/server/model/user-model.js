const mongoose = require('mongoose')

const User = mongoose.model(
    'User',
    new mongoose.Schema(
    {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type:  Number, required: true },
        department: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        confirmationCode:{
            type: String,
            unique: true
        },
        roles:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ]
    })
)

module.exports = User
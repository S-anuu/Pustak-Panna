const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    firstname: {type: String, required: true},
    middlename: {type: String},
    lastname: {type: String, required: true},
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {type: String, 
        required: true,
    },
    
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (err) {
        next(err)
    }
})

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
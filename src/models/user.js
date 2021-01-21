const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:"anonymous",
        trim:true

    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
            throw new Error('age should be a positive number')
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){

            if(!validator.isEmail(value)){
                throw new Error('email is  invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('password contains password')
            }
            
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }

},{
    timestamps:true
})

//virtual properties
userSchema.virtual('tasks',{
    ref:"Task",
    localField:"_id",//where the local data is stored
    foreignField:"owner"//name of the field related

})

//special express behaviour regarding sending back the data
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken= async function (){
    const user = this
    
    const token = jwt.sign({"_id":user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({"token":token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials= async (email,password)=>{

    const user = await User.findOne({"email":email})

    if(!user){
        throw new Error("Unable to login")//no user found
    }
    const isMatch = await bcrypt.compare(password,user.password)
    console.log(isMatch)
     if(!isMatch){
        throw new Error("Unable to login")//incorrect password
     }
     return user

}

//hashing before storing the password middelware
userSchema.pre('save',async function(next){
    const user = this
    console.log("just Before Saving!")
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

//deleting the tasks before deletion of the user
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
    
})

const User = mongoose.model('User',userSchema)



module.exports = User
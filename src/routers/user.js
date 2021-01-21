const express = require("express")
const User = require("../models/user")
const router = new express.Router()
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")
const { sendWelcomeEmail,sendCancellationEmail } = require("../emails/account")




router.post('/users',async(req,res)=>{

    const user = new User(req.body)
    try{
        
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
        //send the error the http status code
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)

    // })
}
)

router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send("unable to login")        
    }
    
})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })//cretates a new array of unused token
        
        await req.user.save()
        res.send()
    } catch (e) {

        res.status(500).send()
        
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
        
    }
})

router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
    
})


router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ["name","age","email","password"]
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send("error: 'Invalid update!")
    }
    try {
        updates.forEach((update)=>{req.user[update] = req.body[update]//accesing the porperty dynacmically
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
    
})


//configuring dest directory
const upload = multer({
    //commented to pass it to the concurrent function
    // dest:"avatar",
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please only upload an image"))
        }
        cb(undefined,true)

    }
})

//register the middleware multer and route
router.post('/users/me/avatar',auth,upload.single("avatar"),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send("avatar Deleted Sucessfully")
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')//by default set to applpication/json
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
        
    }
})

module.exports = router
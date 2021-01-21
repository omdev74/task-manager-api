const express = require("express")
require('./db/mongoose')

const User = require("./models/user")
const Task = require("./models/task")

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT

app.use(express.json())//automatically parses incoming data to an accesible object
app.use(userRouter)//user endpoint
app.use(taskRouter)//task endpoint

app.listen(port,()=>{
    console.log("Server is up on the port "+port)
})


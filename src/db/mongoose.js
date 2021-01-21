const mongoose = require('mongoose')
const connectionUrl = process.env.MONGODB_URL

mongoose.connect(connectionUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,//indexes are created to quickly acces the data
    useUnifiedTopology: true//for deprication error
})



const mongoose = require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete("5ff1017027a0e51c881db313").then(()=>{
//     return Task.countDocuments({ completed: false })
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount("5ffedff8965c1d11282813a9").then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log('e',e)
})

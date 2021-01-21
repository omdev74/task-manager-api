

//normal promise------------------------------------------

// const add = (a, b) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(a + b)
//         }, 2000)
//     })
// }

//promise chainging but complex and inefficeient----------

// add(1, 2).then((sum) => {
//     console.log(sum)

//     add(sum, 5).then((sum2) => {
//         console.log(sum2)
//     }).catch((e) => {
//         console.log(e)
//     })
// }).catch((e) => {   
//     console.log(e)
// })

//efficient promise chaining-------------------------------------

// add(1, 1).then((sum) => {
//     console.log(sum)
//     return add(sum, 4)
// }).then((sum2) => {
//     console.log(sum2)
// }).catch((e) => {
//     console.log(e)
// })

require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5c1a5a34d5a2ec046ca8f6bc', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount("5ff0fe2e9bdb5721b4e6b1a2",2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log('e',e)
})


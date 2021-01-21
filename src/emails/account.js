const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail =(email,name)=>{
    
    sgMail.send({
        to:email,
        from:"omdev74@gmail.com",
        subject:"Thanks for Joining in!",
        text:`Welcome to the app. ${name}.Let me how you get along the app.`
    })    
}

const sendCancellationEmail =(email,name)=>{
    sgMail.send({
        to:email,
        from:"omdev74@gmail.com",
        subject:"Sorry to see you go!",
        text:`Goodbye!. ${name}.hope we see you soon.`
    })
}
module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}

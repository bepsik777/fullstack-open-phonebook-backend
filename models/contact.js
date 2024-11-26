const mongoose = require("mongoose")

mongoose.set('strictQuery', false)
const url = process.env.MONGO_URL
mongoose.connect(url)
    .then(result => {
        console.log("Connected to mongoDB")
    })
    .catch(err => {
        console.log("there was an error when connecting to the DB: ", err.message)
    })


const contactSchema = new mongoose.Schema({
    name: String,
    number: Number
})

contactSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Contact = new mongoose.model("Contact", contactSchema)
console.log("all the code from model runned")
module.exports = Contact

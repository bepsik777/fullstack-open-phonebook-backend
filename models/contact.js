const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGO_URL
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to mongoDB')
  })
  .catch((err) => {
    console.log('there was an error when connecting to the DB: ', err.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Must be at least 3, got {VALUE}'],
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /\d{0,3}-\d{2,8}/.test(v)
      },
      message:
        'Number must be in the format: (between 0 to 3 digits)-(between 2 to 8 digits)',
    },
  },
})

contactSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

const Contact = new mongoose.model('contact', contactSchema)
console.log('all the code from model runned')
module.exports = Contact

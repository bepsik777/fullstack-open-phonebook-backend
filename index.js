require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const PORT = process.env.PORT

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    console.error(error)
    return res.status(400).send('Malformated ID from my own error handler')
  } else if (error.name === 'ValidationError') {
    console.error(error)
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

morgan.token('resbody', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan('tiny'))
app.use(
  morgan(
    ':method :url :status :req[content-length] - :response-time ms :resbody',
    {
      skip: (req, res) => req.method !== 'POST',
    }
  )
)
app.use(express.static('dist'))
app.use(cors())

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

app.get('/', (req, res) => {
  res.send('you want some persons? go to /persons')
})

app.get('/info', async (req, res) => {
  const time = new Date().toString()
  const numOfContacts = await Contact.countDocuments({})
  res.send(`<p>Phonebook has info on ${numOfContacts} people</p><p>${time}<p>`)
})

app.get('/persons', async (req, res) => {
  const allContacts = await Contact.find({})
  res.json(allContacts)
})

app.get('/persons/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const contact = await Contact.findById(id)
    contact ? res.send(contact) : res.status(404).end()
  } catch (e) {
    next(e)
  }
})

app.delete('/persons/:id', async (req, res) => {
  const id = req.params.id
  await Contact.findOneAndDelete({ _id: id })
  res.status(204).end()
})

app.post('/persons', async (req, res, next) => {
  try {
    const contact = req.body
    const contactAlreadyExists =
      (await Contact.findOne({ name: contact.name })) !== null
    console.log(contactAlreadyExists)

    if (contactAlreadyExists) {
      res.status(409).json({ error: 'this contact already exists' })
      return
    }

    const newContact = new Contact({
      name: contact.name,
      number: contact.number,
    })

    const result = await newContact.save()
    res.json(result)
  } catch (e) {
    next(e)
  }
})

app.put('/persons/:id', async (req, res, next) => {
  const id = req.params.id
  const contactFromDB = await Contact.findById(id)
  try {
    if (!contactFromDB) {
      res.status(204).send('no data found with this id')
    }
    const contactFromReq = req.body
    contactFromDB.number = contactFromReq.number
    const result = await contactFromDB.save()
    res.status(200).send(result)
  } catch (e) {
    next(e)
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

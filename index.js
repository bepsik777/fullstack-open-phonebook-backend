const express = require("express")
const notes = require("./notes")
const app = express()

const PORT = 3001
console.log(notes)

app.get("/", (req, res) => {
    res.send("you want some persons? go to /persons")
})

app.get("/info", (req, res) => {
    const time = new Date().toString()
    res.send(`<p>Phonebook has info on ${notes.length} people</p><p>${time}<p>`)
})

app.get("/persons", (req, res) => {
    res.json(notes)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}` )
})
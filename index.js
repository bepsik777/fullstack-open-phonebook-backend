const express = require("express")
const app = express()

const PORT = 3001

app.get("/", (req, res) => {
    res.send("hello world\n")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}` )
})
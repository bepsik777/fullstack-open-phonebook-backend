const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors")
let contacts = require("./contacts");

const PORT = process.env.PORT || 3001;

morgan.token("resbody", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan("tiny"));
app.use(
  morgan(
    ":method :url :status :req[content-length] - :response-time ms :resbody",
    {
      skip: (req, res) => req.method !== "POST",
    }
  )
);
app.use(express.static("dist"))
app.use(cors())


function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

app.get("/", (req, res) => {
  res.send("you want some persons? go to /persons");
});

app.get("/info", (req, res) => {
  const time = new Date().toString();
  res.send(
    `<p>Phonebook has info on ${contacts.length} people</p><p>${time}<p>`
  );
});

app.get("/persons", (req, res) => {
  res.json(contacts);
});

app.get("/persons/:id", (req, res) => {
  const id = req.params.id;
  const note = contacts.find((n) => n.id === id);
  note ? res.send(note) : res.status(404).end();
});

app.delete("/persons/:id", (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter((n) => n.id !== id);
  res.status(204).end();
});

app.post("/persons", (req, res) => {
  const contact = req.body;
  if (!contact.name || !contact.number) {
    res.status(400).json({ error: "name or number fields are missing" });
  }
  if (contacts.find((c) => c.name === contact.name)) {
    res.status(409).json({ error: "this contact already exists" });
  }

  const newContact = { id: getRandomInt(1, 100000), ...contact };
  contacts.push(newContact);
  res.json(newContact);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

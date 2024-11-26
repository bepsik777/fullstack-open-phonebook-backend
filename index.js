require("dotenv").config();
const Contact = require("./models/contact");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
let contacts = require("./contacts");

const PORT = process.env.PORT;

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
app.use(express.static("dist"));
app.use(cors());

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

app.get("/", (req, res) => {
  res.send("you want some persons? go to /persons");
});

app.get("/info", async (req, res) => {
  const time = new Date().toString();
  const numOfContacts = await Contact.countDocuments({});
  res.send(`<p>Phonebook has info on ${numOfContacts} people</p><p>${time}<p>`);
});

app.get("/persons", async (req, res) => {
  const allContacts = await Contact.find({});
  res.json(allContacts);
});

app.get("/persons/:id", async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  console.log(contact, "this is contact");
  contact ? res.send(contact) : res.status(404).end();
});

app.delete("/persons/:id", async (req, res) => {
  const id = req.params.id;
  result = await Contact.findOneAndDelete({ _id: id });
  res.status(204).end();
});

app.post("/persons", async (req, res) => {
  const contact = req.body;
  if (!contact.name || !contact.number) {
    res.status(400).json({ error: "name or number fields are missing" });
  }

  const contactAlreadyExists =
    (await Contact.findOne({ name: contact.name })) !== null;
  console.log(contactAlreadyExists);

  if (contactAlreadyExists) {
    res.status(409).json({ error: "this contact already exists" });
    return;
  }

  const newContact = new Contact({
    name: contact.name,
    number: contact.number,
  });

  const result = await newContact.save();
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

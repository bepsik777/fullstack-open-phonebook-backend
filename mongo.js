const mongoose = require("mongoose");
const { forEach } = require("./contacts");

if (process.argv.length < 3) {
  console.log("You need to provide a password to be able to connect to the DB");
  process.exit(1);
}

const password = process.argv[2];
const URI = `mongodb+srv://bepsik777:${password}@fullstack-open.rhd4c.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack-open`;
mongoose.connect(URI);

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Contact = new mongoose.model("contact", contactSchema);

const main = async () => {
  if (process.argv.length > 3) {
    const contactArgs = process.argv.filter((_, id) => id > 2);
    if (contactArgs.length < 2) {
      console.log("you must provide a name and a number");
      process.exit(1);
    }
    const contact = new Contact({
      name: contactArgs[0],
      number: contactArgs[1],
    });
    await contact.save().then((result) => {
      console.log(result);
    });
  } else {
    await Contact.find({}).then((results) => {
      results.forEach((res) => console.log(res.name, res.number));
    });
  }
  mongoose.connection.close();
};

main();

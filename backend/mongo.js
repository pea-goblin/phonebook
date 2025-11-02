const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log("too few args");
    return;
}
const username = process.argv[2];
const password = process.argv[3];

const url = `mongodb+srv://${username}:${password}@cluster0.tl1cd9v.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

mongoose.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Person = mongoose.model('Person', personSchema);

const findAll = () => {
    // const person = new Person();
    Person.find({}).then(r => {
        r.map(p => {
            console.log(p.name, " ", p.number);
        });
    }).then(r =>
        mongoose.connection.close()

    )
}

const create = (name, number) => {
    const person = new Person({
        name: name || "andre",
        number: number || "1010100101"
    })

    person.save().then(r => {
        console.log("added ", r.name, "number ", r.number, "to phone book");
        mongoose.connection.close();
    })
        .catch(e => {
            console.log(e);
        })
}

if (process.argv.length === 4) {
    findAll();
} else if (process.argv.length === 6) {
    const name = process.argv[4];
    const number = process.argv[5];
    create(name, number);
}
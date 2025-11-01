const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons =
    [
        {
            "id": "1",
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": "2",
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": "3",
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": "4",
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

app.get("/api", (req, res) => {
    res.send("api server");
});

app.get("/api/persons", (req, res) => {
    res.status(200).json(persons);
});

app.get("/api/info", (req, res) => {
    const now = new Date();
    const message = `Phonebook has info for ${persons.length} people
    \n ${now.toString()}`
    res.status(200).send(message);
});

/*
check data null, return status 404.end()
*/
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        res.status(200).json(person)
    } else {
        res.status(404).end();
    }
});

/*
only delete
return status 204, end()
*/
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    return res.status(204).end();
});

const generateId = () => {
    return String(Math.floor(Math.random() * 10000));
}

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: "missing content" });
    }

    const exists = persons.find(person => person.name === body.name);
    if (exists) {
        return res.status(404).json({ error: "conflict content" });
    }
    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons.push(newPerson);
    return res.status(200).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("App is running on " + PORT);
});
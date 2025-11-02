require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const morgan = require("morgan");

const personSchema = require('./models/person');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const app = express();
const errorHandler = (error, request, response, next) => {

    if (error.name === "CastError") {
        return response.status(400).json({ error: "id is invalid format" });
    } else if (error.name === "ValidationError") {
        const messages = Object.values(error.errors)
            .map((e, i) => {
                return `Error ${e.properties.path}: ${e.message};`
            }).join(' ');

        return response.status(400).json({ error: messages });
    }
    response.status(500).json({ error: "internal server error" })
}

mongoose.connect(MONGODB_URI)
    .then(r => {
        console.log("Connected to db");
    })
    .catch(e => {
        console.log("error connect to db:", e.message);
    });

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/api", (req, res) => {
    res.send("api server");
});

app.get("/api/persons", (req, res) => {
    personSchema.find({})
        .then(persons => {
            res.status(200).json(persons);
        })
});

app.get("/info", (req, res, next) => {
    const now = new Date();

    let message = "";
    personSchema.countDocuments({}).then(n => {
        message = `Phonebook has info for ${n} people ${now.toString()}`
        return res.status(200).send(message);
    })
        .catch(e => next(e));
});

/*
check data null, return status 404.end()
*/
app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    personSchema.findById(id)
        .then(person => {
            if (person) {
                res.status(200).json(person)
            } else {
                res.status(404).end();
            }
        })
        .catch(e => next(e));
});

/*
only delete
return status 204, end()
*/
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    personSchema.findByIdAndDelete(id)
        .then(r => {
            return res.status(204).json(r);
        })
        .catch(e => next(e));
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: "body is missing" });
    }
    const person = new personSchema({
        name: body.name,
        number: body.number
    });
    person.save().then(p => {
        res.status(200).json(p);
    })
        .catch(e => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { body } = req;
    const id = req.params.id;

    personSchema.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).end();
            }
            person.name = body.name;
            person.number = body.number;
            person.save().then(p => {
                res.status(200).json(p);
            })
        })
        .catch(e => next(e));
});

const unknownEndpoint = (req, res, next) => {
    res.status(404).json({ error: "page is not exist" });
    next();
}

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("App is running on " + PORT);
});
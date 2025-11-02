const personSchema = require('../models/person');
const mongoose = require('mongoose');
const config = require('../utils/config');

const app = require('express').Router();

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

module.exports = app;
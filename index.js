require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require("cors")
const app = express();
const Person = require("./models/person")
const PORT = process.env.PORT || 3001;

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static("dist"))
app.use(cors())
app.use(morgan((tokens, req, res) => {
    const arr = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ]
    if (tokens.method(req) === 'POST') {
        arr.push(tokens.body(req))
    }
    return arr.join(' ')
}))


app.get("/", (req, res) => {
})
app.get('/info', (req, res) => {
    Person.find({}).then(savedPersons => {
        res.end(`
        <p>Phonebook has info for ${savedPersons.length} people</p>
        <p>${new Date()}</p>
        `)
    })
})
app.get('/api/persons', (req, res) => {
    Person.find({}).then(savedPersons => {
        res.json(savedPersons)
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.phoneNumber) {
        res.status(422).json({
            error: "Missing body name or number"
        })
    } /*else if (persons.filter(p => p.name === person.name).length > 0) {
        res.status(409).json({
            error: "Name must be unique"
        })
    } */else {
        const person = new Person({
            name: body.name,
            phoneNumber: body.phoneNumber
        })
        person.save().then(savedPerson => {
            res.json(savedPerson)
        })
    }

})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id);
    if (!!person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id);
    res.send(204).end();
})

app.listen(PORT, () => {
    console.log(`Listening port: ${PORT}`)
})
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

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    if (!body.name || !body.phoneNumber) {
        res.status(422).json({
            error: "Missing body name or number"
        })
    } /*else if (persons.filter(p => p.name === person.name).length > 0) {
        res.status(409).json({
            error: "Name must be unique"
        })
    } */ else {
        const person = new Person({
            name: body.name,
            phoneNumber: body.phoneNumber
        })
        person.save()
            .then(savedPerson => res.json(savedPerson))
            .catch(error => next(error))
    }

})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end()
            }
        })
        .catch(err => {
            next(err)
        })
})
app.put('/api/persons/:id', (req, res, next) => {
    const person = req.body
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
})
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).end())
        .catch(error => next(error))
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "Unknown endpoint"})
}
app.use(unknownEndPoint)
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.error(error)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listening port: ${PORT}`)
})
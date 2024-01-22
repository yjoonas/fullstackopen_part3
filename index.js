const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json())

let persons = [
    {
     id: 1,
     name: "Matti meikäläinen",
     number: "123-123-123"
    },
    {
     id: 2,
     name: "Maija meikäläinen",
     number: "123-123-123"
    },
    {
     id: 3,
     name: "Martta meikäläinen",
     number: "123-123-123"
    },
    {
     id: 4,
     name: "Mauri meikäläinen",
     number: "123-123-123"
    },

]

app.get('/info', (req, res) => {
    res.end(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})
app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.post('/api/persons', (req, res) => {
    const person = req.body;
    const id = Math.floor(Math.random() * 100000000)
    if (!person.name || !person.number) {
        res.status(422).json({
            error: "Missing body name or number"
        })
    } else if (persons.filter(p => p.name === person.name).length > 0) {
        res.status(409).json({
            error: "Name must be unique"
        })
    } else {
        persons = persons.concat({
            ...person, id
        })
        res.json(person)
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
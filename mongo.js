const mongoose = require('mongoose')

function close(mongoose) {
    mongoose.connection.close().then(() => console.log('Closed connection'))
}

if (process.argv.length < 3) {
    console.log('Provide password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.1nqcsit.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => console.log('Connected to cluster'))

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 5) {
    const name = process.argv[3]
    const phoneNumber = process.argv[4]
    const person = new Person({
        name, phoneNumber
    })
    person.save().then(() => {
        console.log(`Added ${name} number ${phoneNumber} to phonebook`)
        close(mongoose)
    })
} else {
    Person.find({}).then(persons => {
        console.log('Phonebook:')
        persons.forEach(p => {
            console.log(p.name, p.phoneNumber)
        })
        close(mongoose)
    })
}


const mongoose = require("mongoose")

const uri = process.env.MONGODB_URI

mongoose.connect(uri)
.then(() => {
    console.log("Connected to Mongodb")
})
.catch(error => {
    console.log("Error connecting to Mongodb:", error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = new mongoose.model("Person", personSchema)

module.exports = Person;
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
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: 3,
    },
    phoneNumber: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /\d+-\d+/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! 123-1231213 is correct format`
        },
        required: true
    },
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
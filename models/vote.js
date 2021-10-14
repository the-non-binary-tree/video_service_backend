const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const voteSchema = new mongoose.Schema({
    value: {
        type: Boolean,
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {timestamps: true}
)

voteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

voteSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Vote', voteSchema)
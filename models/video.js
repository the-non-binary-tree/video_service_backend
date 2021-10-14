const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const videoSchema = new mongoose.Schema({
    videoTitle: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    url: {
        type: String,
        required: true,
        minLength: 3
    }
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
    // channel: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Channel',
    //     required: true
    // },
    // votes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Vote'
    // }],
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }]
},
    {timestamps: true}
)

videoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

videoSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Video', videoSchema)
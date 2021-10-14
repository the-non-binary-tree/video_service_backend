const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {timestamps: true}
)

channelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Channel', channelSchema)
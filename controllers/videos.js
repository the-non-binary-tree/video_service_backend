const videosRouter = require('express').Router()
const Video = require('../models/video')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const aws = require('aws-sdk')

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})

const s3 = new aws.S3()
s3.listBuckets(function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});



const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }

    return null
}

videosRouter.get('/', async (request, response, next) => {
    const videos = await Video
        .find({}).sort({_id: -1})
    response.json(videos)

})

videosRouter.get('/:id', async (request, response, next) => {
    const videoToGet = await(Video.findById(request.params.id))
    if (videoToGet) {
        response.json((videoToGet.toJSON()))
    } else {
        response.status(404).end()
    }
})

// videosRouter.post('/upload', async (request, response) => {
//     const body = request.body
    
//     const token = getTokenFrom(request)
//     const decodedToken = jwt.verify(token, process.env.SECRET)
//     if (!token || !decodedToken.id) {
//         return response.status(401).json({ error: 'token missing or invalid' })
//     }

//     const user = await User.findById(decodedToken.id)
// })

videosRouter.post('/upload', async (request, response) => {
    const body = request.body
    // //user authentication
    // const token = getTokenFrom(request)
    // const decodedToken = jwt.verify(token, process.env.SECRET)
    // if (!token || !decodedToken.id) {
    //     return response.status(401).json({ error: 'token missing or invalid' })
    // }
    // const user = await User.findById(decodedToken.id)

    try {
        if(!request.files) {
            response.send({
                status: false,
                message: 'No file uploaded'
            })
        } else {
            //'videoFile' in the request.files is the name of the input field
            var videoFile = request.files.videoFile

            //move the videoFile to the folder uploads on the server
            var filePath = './uploads/' + videoFile.name
            videoFile.mv(filePath)
            
            var uploadParams = {Bucket: process.env.AWS_DEFAULT_BUCKET, Key: '', Body: ''};

            // Configure the file stream and obtain the upload parameters
            var fs = require('fs');
            var fileStream = fs.createReadStream(filePath);
            fileStream.on('error', function(error) {
                console.log('File Error', error);
            });
            uploadParams.Body = fileStream;
            var path = require('path');
            uploadParams.Key = path.basename(filePath);
            

            // call S3 to retrieve upload file to specified bucket
            s3.upload (uploadParams, function (error, data) {
                if (error) {
                    console.log("Error", error);
                } if (data) {
                    console.log("Upload Success", data.Location);
                    //data.Location is the url to give to database
                    const videoUrl = JSON.stringify(data.Location)
                                    
                    //create video Object
                    const video = new Video({
                        videoTitle: body.videoTitle,
                        url: videoUrl
                        // user: user._id
                    })
                    const savedVideo = await video.save()
                    // const savedVideo = await video.save()
                    // // user.videos = user.videos.concat(savedVideo._id)
                    // // await user.save()
                    // response.json(savedVideo)
                    
                }
            })
            response.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: videoFile.name,
                    mimetype: videoFile.mimetype,
                    size: videoFile.size
                }
            })
        }
    } catch (error) {
        response.status(500).send(error)
    }

})




module.exports = videosRouter
require('dotenv').config({ path: './.env' }); 
const mongoose = require('mongoose');
const axios = require('axios'); 
const AWS = require('aws-sdk');
const movieModel = require('./models/movie.model'); 

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION 
});
const s3 = new AWS.S3();

async function migrateImagesToS3() {
    try {

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');

        const movies = await movieModel.find({ poster: { $regex: '^https?://' } });

        if (movies.length === 0) {
            console.log('No movies found with external poster URLs to migrate.');
            return;
        }

        console.log(`Found ${movies.length} movies to migrate...`);

        for (const movie of movies) {
            try {
                const response = await axios({
                    url: movie.poster,
                    responseType: 'arraybuffer'
                });
                const imageBuffer = Buffer.from(response.data);

                const key = `posters/${movie._id}.jpg`;
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: key,
                    Body: imageBuffer,
                    ContentType: response.headers['content-type'] || 'image/jpeg'
                };

                const uploadResult = await s3.upload(params).promise();
                const posterUrl = uploadResult.Location;
                await movieModel.findByIdAndUpdate(movie._id, { poster: posterUrl });
                console.log(`Successfully migrated poster for movie ID: ${movie._id} to ${posterUrl}`);

            } catch (uploadError) {
                console.error(`Failed to migrate poster for movie ID: ${movie._id}`, uploadError);
            }
        }

        console.log('Image migration complete.');

    } catch (dbError) {
        console.error('Database connection failed:', dbError);
    } finally {
        await mongoose.disconnect();
    }
}

migrateImagesToS3();

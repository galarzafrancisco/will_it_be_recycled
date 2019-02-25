// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Read the API key from a .env file
require('dotenv').load();
const api_key = process.env.API_KEY;


// Creates a client

let photo_path = './photos/IMG_5596.JPG';


const client = new vision.ImageAnnotatorClient();

client.labelDetection(photo_path)
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  });
  
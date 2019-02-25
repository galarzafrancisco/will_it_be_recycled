// Libraries
const router = require('express').Router();
const Multer = require('multer');
const vision = require('@google-cloud/vision');
const classify = require('../modules/classify');
const populateCategories = require('../modules/populate_categories');
const db = require('../modules/db');

// multer configuration
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 15000000,
        files:1
    }
});


// Dummy endpoint
router.get('/', (req, res) => {
    res.status(200).send('Welcome to the API!');
})

// Endpoint to post the images
router.post('/', multer.single('filetoupload'), (req, res, next) => {
    // Send the picture to the Vision API
    const visionClient = new vision.ImageAnnotatorClient();
    visionClient.labelDetection(req.file.buffer)
        .then(results => {
            // Analyse lables
            classify(results, (category) => {
                // Send the response back to the Front End
                res.send(category);
            })
        })
        .catch(err => {
            console.log('Something went wrong:');
            console.log(err);
            res.status(500).send('Oops! Something went wrong :(');
        });
});

// Endpoint to test labels
router.get('/test/:label', (req, res) => {
    const label = req.params.label
    db.find(label)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err))
});

// Populate memcached data
(function populateMemcachedData() {
    console.log('Updating memcached...');
    populateCategories();
    setTimeout(populateMemcachedData, 30000);
})()

// Export the router
module.exports = router;
// Libraries
const express = require('express');
var cors = require('cors');


//  Configuration
require('dotenv').config()
const port = process.env.PORT || 8080;


// App
const app = express();

// Routes
const api = require('./routes/api');

// Middleware
app.use(cors());
app.use('/static', express.static('static'));
app.use('/api', api);


// API test index page
app.get('/', (req, res) => {
    const html = `
    <form action="api" method="post" enctype="multipart/form-data">
        <input type="file" name="filetoupload"><br>
        <input type="submit">
    </form>
    `
    res.status(200).send(html);
});


// Error page
app.all('*', (req, res) => {
    res.status(404).send('Ooops! There\'s nothing here :(');
});


// Start the server
const server = app.listen(port, () => {
    console.log(`App listening in port ${port}...`)
});

const recycle_categories = require('./recycle_categories')
const memjs = require('memjs');

if (
    !(process.env.MEMCACHE_URL) ||
    !(process.env.MEMCACHE_USERNAME) ||
    !(process.env.MEMCACHE_PASSWORD)
) {
    console.log('Credentials for memcache not found.');
    throw new Error('Credentials for memcache not found.');
}

// Memcache client
const mc = memjs.Client.create(process.env.MEMCACHE_URL, {
    username: process.env.MEMCACHE_USERNAME,
    password: process.env.MEMCACHE_PASSWORD
});


function find(label) {
    `
    Finds what bins contain the lable. e.g. 'glass' will return 'yellow'.
    `
    // let categories = Object.keys(recycle_categories);
    // categories = categories.filter(category => recycle_categories[category].includes(label))
    // return categories;
    return new Promise((resolve, reject) => {
        mc.get(label, function(err, value, key) {
            if(value != null) {
                resolve([value.toString()])
            } else {
                resolve([])
            }
        })
    });
}

module.exports = {
    find: find
}
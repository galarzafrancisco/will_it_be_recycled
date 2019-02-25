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

function populateCategories() {
    // Memcache client
    const mc = memjs.Client.create(process.env.MEMCACHE_URL, {
        username: process.env.MEMCACHE_USERNAME,
        password: process.env.MEMCACHE_PASSWORD
    });

    let itemsPending = 0;
    Object.keys(recycle_categories).forEach(bin => {
        recycle_categories[bin].forEach(label => {
            itemsPending += 1;
            mc.set(label, bin, {expires: 120}, (err, value) => {
                itemsPending -= 1;
            })
        })
    })

    function waitForItemsToBeAdded() {
        if (itemsPending > 0) {
            console.log('Waiting for items to be added...');
            setTimeout(waitForItemsToBeAdded, 3000);
        } else {
            mc.close();
        }
    }

    waitForItemsToBeAdded()
}


module.exports = populateCategories
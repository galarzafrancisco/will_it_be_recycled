const db = require('./db');
const {PubSub} = require('@google-cloud/pubsub');



const confidence_threshold = 0.4;

const pubsub_client = new PubSub({projectId: 'servianhack-the-gcp-3'});


function streamSearch(search) {
    data = {
        destination: {
            dataset: 'logs',
            table: 'searches'
        },
        data: {
            label: search.label,
            bin: search.bins[0],
            score: search.score
        }
    }
    const dataBuffer = Buffer.from(JSON.stringify(data));    
    pubsub_client.topic('streamLogs').publish(dataBuffer, (err, messageId) => {
        if (err) {
            console.log('Error publishing')
            console.log(err)
        } else {
            console.log('Publishing success')
            console.log(messageId)
        }
    });
}

function streamClassification(classification) {
    data = {
        destination: {
            dataset: 'logs',
            table: 'classifications'
        },
        data: {
            bin: classification,
        }
    }
    const dataBuffer = Buffer.from(JSON.stringify(data));    
    pubsub_client.topic('streamLogs').publish(dataBuffer, (err, messageId) => {
        if (err) {
            console.log('Error publishing')
            console.log(err)
        } else {
            console.log('Publishing success')
            console.log(messageId)
        }
    });
}

function classify(attributes, callback) {
    const top_labels = attributes[0].labelAnnotations
        .filter(label => label.score >= confidence_threshold)
        .map(label => {
            return {
                description: label.description.toLowerCase(),
                score: label.score
            }
        });


    const promiseArray = []
    const classified_labels = []
    top_labels.forEach(label => {
        promiseArray.push(db.find(label.description));
        classified_labels.push({
            label: label.description,
            bins: null,
            score: label.score
        });
    });
    Promise.all(promiseArray)
        .then(bins => {
            let idx=0;
            bins.forEach(bin => {
                classified_labels[idx].bins = bin
                idx += 1;
            });


            console.log(JSON.stringify(classified_labels, null, 2))

            const classification = {}
            let maxScore = -9999;
            let winnerBin = 'undefined';
            classified_labels.forEach(classified_lable => {
                // Send log to BQ
                streamSearch(classified_lable);
                classified_lable.bins.forEach(bin => {
                    if (classification.hasOwnProperty(bin)) {
                        classification[bin].score += classified_lable.score;
                    } else {
                        classification[bin] = {
                            score: classified_lable.score
                        }
                    }
                    if (classification[bin].score > maxScore) {
                        maxScore = classification[bin].score;
                        winnerBin = bin;
                    }
                });
            });
            streamClassification(winnerBin);
            callback({bin: winnerBin});
        });
}


module.exports = classify;
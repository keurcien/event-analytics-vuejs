const express = require('express')
const bodyParser = require('body-parser')
const elasticsearch = require('elasticsearch')
const cors = require('cors')
const app = express()

const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
})

client.ping({
    requestTimeout: 3000
}, function(error) {
    if (error) {
        console.log('Elasticsearch cluster is down')
    } else {
        console.log('Everything is ok')
    }
})

app.use(bodyParser.json())
app.use(cors())
app.listen(process.env.PORT || 8081)

app.get('/status', (req, res) => {
    res.send({
        message: 'hello world!'
    })
})

app.post('/search', function (req, res) {
    let body = {
        aggs: {
            campaigns: {
                terms: {
                    field: "campaign_id"
                }, 
                aggs: {
                    date: {
                        terms: {
                            field: "date_start"
                        },
                        aggs: {
                            campaign_spend: {
                                sum: {
                                    field: "spend"
                                }
                            }
                        }
                    }
                }
            }
        }    
    }
    client.search({
        index: 'ads-facebook-adset',
        size: 100,
        body: body
    }).then(results => {
        res.send({
            'campaigns': results.aggregations.campaigns.buckets
        })
    })
})

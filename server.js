const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

MongoClient.connect('connectionString', { useUnifiedTopology: true })
    .then(client => {
    console.log('Connected to Database')
    const db = client.db('Stars-Wars-Project')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs', (req, res) => {
        res.render(view, locals)
    })

    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
        .then(quotes => {
            res.render('index.ejs', {quotes: quotes})
        })
        .catch(error => console.error(error))
    })

    app.post('/quotes', (req,res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
       .catch(error => console.error(error))
    })

    app.put('/quotes', (req,res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda'},
            { 
                $set: {
                    name: req.body.name,
                    quote: req.body.qoute
                }
            },
             {
                upsert: true
            }
        )
        .then(result => {
            console.log(result)
        })
        .catch(error => console.error(error))
    })

    app.listen(3000, function() {
        console.log('listening on 3000')
    })
    })
    .catch(error => console.error(error))


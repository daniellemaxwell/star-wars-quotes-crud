const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const dotenv = require('dotenv').config()



MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true })
    .then(client => {
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
                    quote: req.body.quote
                }
            },
             {
                upsert: true
            }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            { name: req.body.name },
        )
        .then(result => {
            if(result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vader's quote`)
        })
        .catch(error => console.error(error))
    })

    app.listen(process.env.PORT, () => {
        
    })

    })
    .catch(error => console.error(error))


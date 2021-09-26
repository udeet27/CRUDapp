// server.js
console.log('May Node be with you');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const connectionString="mongodb+srv://stark:starkisawesome@cluster0.yffqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.use(express.json())

MongoClient.connect(connectionString, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')

    const quotesCollection = db.collection('quotes')


    
    app.listen(3000, function() {
        console.log('listening on 3000')
      });
      app.set('view engine', 'ejs')

    
      app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
          .then(results => {
            res.render('index.ejs', { quotes: results })
          })
          .catch(error => console.error(error))
      })
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
              .then(result => {
                res.redirect('/')
              })
              .catch(error => console.error(error))
          })

          app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
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
          } )

          app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
              { name: req.body.name }
            )
              .then(result => {
                if (result.deletedCount === 0) {
                  return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vader\'s quote')
              })
              .catch(error => console.error(error))
          })
  });



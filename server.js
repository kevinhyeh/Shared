const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
console.log('connection uri', process.env.MONGODB_CONNECTION_URI);
const client = new MongoClient(process.env.MONGODB_CONNECTION_URI, { useNewUrlParser: true });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//allow api to be accessed by other apps (CORS)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS, PUT, DELETE"
  );
  next();
});


// app.use(express.static("views"));

app.listen(3001, function() {
  client.connect(err => {
    const collection = client.db(process.env.TEST_DB).collection("Users");
    console.log("Connected to mongodb");
    // perform actions on the collection object
    app.get('/', function(req, res) {
        var testObject = {
          name: 'kevin',
          height: 'tall'
        }
        collection.insertOne(testObject, (error, response) => {
          if (err) { console.log('err', error) }
          console.log('response', response)
        })
        res.send('hi')
      })

    app.post('/new-user', function(req, res) {
      collection.insertOne(req.body, (error, response) => {
        if(err) {
          console.log(error)
        } else {
          console.log(response, 'Success')
        }
      })
    })
  });
});
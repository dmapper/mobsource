import { MongoClient, ObjectID } from 'mongodb'
import bodyParser from 'body-parser'
import express from 'express'
const path = require('path')
const port = process.env.PORT || 8080
const app = express()
let db

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/user', (req, res) => {
  db.collection('users').insert({login: req.body.login, password: req.body.password}, err => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    res.sendStatus(200)
  })
})
app.get('/user/:id', (req, res) => {
  db.collection('users').findOne({_id: ObjectID(req.params.id)}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    res.send(docs)
  })
})

app.get('/users', (req, res) => {
  db.collection('users').find().toArray((err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    res.send(docs)
  })
})

MongoClient.connect('mongodb://localhost:27017/mobsource', (err, database) => {
  if (err) return console.log(err)
  db = database.db('dbo')
  app.listen(port, () => {
    console.log('Started on localhost:8080')
  })
})

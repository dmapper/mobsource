// import { ObjectID } from 'mongodb'
import { MongoClient } from 'mongodb'
import bodyParser from 'body-parser'
import express from 'express'
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io')(server)
let db

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
io.on('connection', socket => {
  socket.emit('online', io.engine.clientsCount)
  socket.on('disconnect', () => {
    socket.emit('online', io.engine.clientsCount)
  })
  socket.on('update', () => {
    socket.emit('online', io.engine.clientsCount)
  })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/signin', (req, res) => {
  db.collection('users').findOne({login: req.query.login, password: Buffer.from(req.query.password, 'base64').toString('ascii')}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      if (docs === null) {
        res.send({message: 'User not found'})
      } else {
        res.send({id: docs._id, login: docs.login})
      }
    }
  })
})

app.post('/signup', (req, res) => {
  db.collection('users').findOne({login: req.body.login}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      if (docs === null) {
        db.collection('users').insert({login: req.body.login, password: Buffer.from(req.body.password, 'base64').toString('ascii')}, err => {
          if (err) {
            console.log(err)
            return res.sendStatus(500)
          } else {
            res.send({message: 'User created successfully'})
          }
        })
      } else {
        res.send({message: 'User alredy exist'})
      }
    }
  })
})

// app.get('/user/:id', (req, res) => {
//   db.collection('users').findOne({_id: ObjectID(req.params.id)}, (err, docs) => {
//     if (err) {
//       console.log(err)
//       return res.sendStatus(500)
//     }
//     res.send(docs)
//   })
// })
//
// app.get('/users', (req, res) => {
//   db.collection('users').find().toArray((err, docs) => {
//     if (err) {
//       console.log(err)
//       return res.sendStatus(500)
//     }
//     res.send(docs)
//   })
// })

MongoClient.connect('mongodb://localhost:27017/mobsource', (err, database) => {
  if (err) return console.log(err)
  db = database.db('dbo')
  server.listen(port, () => {
    console.log(`Started on localhost:${port}`)
  })
})

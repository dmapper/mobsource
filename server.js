const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
let db
const port = process.env.PORT || 3000
const dbpath = process.env.DB || 'mongodb://localhost:27017/mobsource'
let result = {o1: 0, o2: 0, o3: 0}

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

io.on('connection', socket => {
  socket.emit('data', { online: io.engine.clientsCount, result })
  socket.on('disconnect', () => {
    socket.emit('data', { online: io.engine.clientsCount, result })
  })
  socket.on('update', () => {
    socket.emit('data', { online: io.engine.clientsCount, result })
  })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  next()
})

app.get('/signin', (req, res) => {
  db.collection('mobsourcelifeusers').findOne({login: req.query.login, password: Buffer.from(req.query.password, 'base64').toString('ascii')}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      if (docs === null) {
        res.send({message: 'User not found'})
      } else {
        res.send({message: 'Successfully', id: docs._id, login: docs.login})
      }
    }
  })
})

app.post('/vote', (req, res) => {
  result[`o${req.body.option}`]++
  res.send({message: 'User voted successfully', result})
})
app.delete('/vote', (req, res) => {
  result = {o1: 0, o2: 0, o3: 0}
  res.send({message: 'Voting results are deleted', result})
})

app.get('/user/:id', (req, res) => {
  db.collection('mobsourcelifeusers').findOne({_id: ObjectID(req.params.id)}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      res.send({message: 'Successfully', login: docs.login})
    }
  })
})

MongoClient.connect(dbpath, (err, database) => {
  if (err) return console.log(err)
  db = database.db('dbo')
  server.listen(port, () => {
    console.log(`Started on localhost:${port}`)
  })
})

import { MongoClient, ObjectID } from 'mongodb'
import bodyParser from 'body-parser'
import express from 'express'
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
let db
const port = process.env.PORT || 3000
const dbpath = 'mongodb://localhost:27017/mobsource'
// const port = process.env.PORT || 8080
// const dbpath = 'mongodb://10.142.0.4:27017,10.142.0.5:27017,10.142.0.6:27017/mobsourcelife?replicaSet=rs1'

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
let res = {o1: 0, o2: 0, o3: 0}
const data = cb => {
  db.collection('votes').find({ }).toArray((err, docsres) => {
    if (err) {
      console.log(err)
    } else {
      let o1 = 0
      let o2 = 0
      let o3 = 0
      docsres.forEach(i => {
        if (+i.option === 1) o1++
        if (+i.option === 2) o2++
        if (+i.option === 3) o3++
      })
      res = {o1, o2, o3}
      cb && cb(res)
    }
  })
}
io.on('connection', socket => {
  data()
  socket.emit('data', { online: io.engine.clientsCount, res })
  socket.on('disconnect', () => {
    socket.emit('data', { online: io.engine.clientsCount, res })
  })
  socket.on('update', () => {
    socket.emit('data', { online: io.engine.clientsCount, res })
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
  db.collection('users').findOne({login: req.query.login, password: Buffer.from(req.query.password, 'base64').toString('ascii')}, (err, docs) => {
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
        res.send({message: 'User already exist'})
      }
    }
  })
})

app.post('/vote', (req, res) => {
  db.collection('votes').findOne({user_id: req.body.user_id}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      if (docs === null) {
        db.collection('votes').insert({option: req.body.option, user_id: req.body.user_id}, async err => {
          if (err) {
            console.log(err)
            return res.sendStatus(500)
          } else {
            data(result => res.send({message: 'User voted successfully', result}))
          }
        })
      } else {
        res.send({message: 'User already voted', option: +docs.option})
      }
    }
  })
})
app.delete('/vote', (req, res) => {
  db.collection('votes').remove({ }, err => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      data()
      res.send({message: 'Voting results are deleted'})
    }
  })
})

app.get('/user/:id', (req, res) => {
  db.collection('users').findOne({_id: ObjectID(req.params.id)}, (err, docs) => {
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

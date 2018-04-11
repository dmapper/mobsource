const MongoClient = require('mongodb').MongoClient
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
const data = cb => {
  db.collection('mobsourcelifevotes').find({ }).toArray((err, docsres) => {
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
      result = {o1, o2, o3}
      cb && cb(result)
    }
  })
}

io.on('connection', socket => {
  data()
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

app.post('/vote', (req, res) => {
  db.collection('mobsourcelifevotes').findOne({user_id: req.body.user_id}, (err, docs) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      if (docs === null) {
        db.collection('mobsourcelifevotes').insert({option: req.body.option, user_id: req.body.user_id}, err => {
          if (err) {
            console.log(err)
            return res.sendStatus(500)
          } else {
            data(result => res.send({message: 'User voted successfully', result}))
          }
        })
      } else {
        db.collection('mobsourcelifevotes').replaceOne({user_id: req.body.user_id}, {option: req.body.option, user_id: req.body.user_id}, err => {
          if (err) {
            console.log(err)
            return res.sendStatus(500)
          } else {
            data(result => res.send({message: 'User voted successfully', result}))
          }
        })
      }
    }
  })
  // result[`o${req.body.option}`]++
  // res.send({message: 'User voted successfully', result})
})
app.delete('/vote', (req, res) => {
  db.collection('mobsourcelifevotes').remove({ }, err => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      data()
      res.send({message: 'Voting results are deleted'})
    }
  })
  // result = {o1: 0, o2: 0, o3: 0}
  // res.send({message: 'Voting results are deleted', result})
})

MongoClient.connect(dbpath, (err, database) => {
  if (err) return console.log(err)
  db = database.db('dbo')
  server.listen(port, () => {
    console.log(`Started on localhost:${port}`)
  })
})

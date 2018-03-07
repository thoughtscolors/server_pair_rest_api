const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const uuid = require('uuid/v4')
const port = process.env.PORT || 3000

app.disable('x-powered-by')
if (process.env.NODES_ENV === "development") {
  app.use(morgan('dev'))
}
app.use(bodyParser.json())

const events = []

app.get('/events', (req, res) => {
  res.status(200).json(events)
})

app.get('/events/:id', (req, res) => {
  console.log('rrrrrrrr', req.params)
  let id = req.params.id
  const eventFound = events.filter(event => event.id === id)
  console.log('eeeeeee', eventFound)
  if(eventFound[0]) {
    res.status(200).json(eventFound[0])
  } else {
    res.status(404).json({ error: {message : 'Event not found'}})
  }
})

app.post('/events', (req, res) => {
  var title = req.body.title
  var desc = req.body.description
  var date = req.body.date
  var time = req.body.time
  var dur = req.body.duration
  if (title && desc && date && time && dur) {
    var newEvent = {
      id: uuid(),
      title,
      desc,
      date,
      time,
      dur
    }
    events.push(newEvent)
    res.status(201).json(newEvent)
  } else {
    res.status(400).json({error: {message: "Bad request, all fields required"}})
  }
})

app.put('/events/:id', (req, res) => {
  var title = req.body.title
  var desc = req.body.description
  var date = req.body.date
  var time = req.body.time
  var dur = req.body.duration
  if (!title || !desc || !date || !time || !dur) {
    res.status(400).json({error: {message: "Bad request, all fields required"}})
  }
  let id = req.params.id
  events.forEach(event => {
    if (event.id === id) {
      event.title = title
      event.desc = desc
      event.date = date
      event.time = time
      event.dur = dur
      res.status(200).json(event)
    }
  })
})

app.delete('/events/:id', (req, res) => {
  let id = req.params.id
  events.forEach((event, index) => {
    if(event.id === id) {
      events.splice(index, 1)
      res.status(200).json(event)
    }
  })
  res.status(404).json({ error: {message: 'Event not found'}})
})


app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({error: err})
})

app.use((err, req, res, next) => {
  res.status(404).json({error: { message: "General Not found" } })
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})

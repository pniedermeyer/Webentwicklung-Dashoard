const express = require('express')
const app = express()

app.get('/geo-data', (rq, res) => {
  res.json({ test: 'test' })
})

app.get('/data')

app.listen(3000)

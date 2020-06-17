import express from 'express'
import mapDataManager from '../src/map-data-manager/map-data-manager.js'

// const express = require('express')
const app = express()

app.get('/geo-data', (req, res) => {
  // res.json({ test: 'test' })
  mapDataManager.getGeoData().then((data) => {
    res.send(data)
  })
})

app.get('/data', (req, res) => {
  mapDataManager.getData().then((data) => {
    res.send(data)
  })
})

app.listen(3000)

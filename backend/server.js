require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const recipeRoutes = require('./routes/recipes')

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/recipes', recipeRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
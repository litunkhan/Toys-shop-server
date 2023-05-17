const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()


const app = express()
// middlewar
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Start server')
})
app.listen(port,(req,res)=>{
    console.log('Server running Succesgully',)
})



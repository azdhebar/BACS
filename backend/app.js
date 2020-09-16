const express = require('express');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')

//routes
const authRoute = require('./routes/authRoute')



app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

//route
app.use('/api',authRoute)

mongoose.connect('mongodb+srv://abbas:abbas@cluster0-w8rje.mongodb.net/bacs?retryWrites=true&w=majority',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log('connected')
})
mongoose.connection.on('error',(err)=>{
    console.log(err)
})


app.listen(8000,()=>{
    console.log('http://127.0.0.1:8000');
})
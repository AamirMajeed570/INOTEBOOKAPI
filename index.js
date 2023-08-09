const connection  = require('./db');
const express = require('express');
connection();//Connect to mongodb Database
var cors = require('cors')
const app = express();
 
app.use(cors())
 
app.use(express.json());
const port = 5000;
const host ='localhost';
//Routes for Routing
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


app.listen(port ,()=>{
    console.log(`Server is listening at http://${host}:${port}`)
})


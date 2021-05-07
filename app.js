const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(__dirname+'/dist'))
// Body-Parser
app.use(express.urlencoded( {extended:false} ));

app.use(express.json());

app.get('*', (req, res)=> res.sendFile(__dirname+'/dist/index.html'))

app.listen(PORT, console.log(`Server runnign at port: ${PORT}`));

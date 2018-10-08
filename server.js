const express = require('express');
const port = 3000;
const app = express();
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});

app.get('/', function (req, res) {
res.send('<h1>Hello World!</h1>')
});

express.static('dist');
app.use(express.static('dist'));

// express.static('src');
// app.use(express.static('src'));
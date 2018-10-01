const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '/../public');
var app = express();

//we configure express static middleware - with the
//serving path
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
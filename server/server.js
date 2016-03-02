var express = require('express');
var app = express();
var path = require('path');
var multer  = require('multer');
var upload = multer({ dest: './uploads/' })

var port = process.env.PORT || 3030;

app.use(express.static(path.join(__dirname, '../public')));

app.post('/documents',upload.any(), function (req, res) {
	console.log("File was saved");
});

app.listen( port, function(){
	console.log('conectado en ', port);
});




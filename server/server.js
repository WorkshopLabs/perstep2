var express = require('express');
var app = express();
var path = require('path');
var multer  = require('multer');

var port = process.env.PORT || 3030;

/*Storage configuration*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage })


app.use(express.static(path.join(__dirname, '../public')));

app.post('/documents',upload.any(), function (req, res) {
	console.log("Saving file...");
});

app.listen( port, function(){
	console.log('Listen to port: ', port);
});




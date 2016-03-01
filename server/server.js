var express = require('express');
var app = express();
var path = require('path');
var multer  = require('multer');
var upload = multer({ dest: './uploads/' })


var port = process.env.PORT || 3030;

app.use(express.static(path.join(__dirname, '../public')));

/*Configure the multer.*/

app.post('/profile', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log("Error while uploading file");
      return
    }
    console.log("Success while uploading file");
  })
})

app.listen( port, function(){
	console.log('conectado en ', port);
});




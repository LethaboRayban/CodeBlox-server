/**********************************************************************
  Server for incoming connection from clients
**********************************************************************/

var express = require('express');
var app = express();
var mongo = require('mongojs');
var db = mongo('dbPerson', ['persons']);
var bodyParser = require("body-parser");
var bcrypt = require('bcrypt');
var SALT = "$2a$10$.b.ov84QXKdDd2CC7PZPl.";
var net = require('net');
var socket=net.Socket;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded());
var router = express.Router();
var sockets = [];

<<<<<<< HEAD
var server = app.listen(process.env.PORT || 3030,function(){
=======
//Local connection 
var server = app.listen(process.env.PORT || 3000,function(){
>>>>>>> 5cc884ee3c74a3a478d7273c6f9a04051f4f9a0f
  var port = server.address().port;
  console.log("Server running on port: " + port);
});

//web remote connection
var serverNet = net.createServer(function(socke) {

    socket=socke;
	socket.write(''+0);
	socket.pipe(socket);
});

serverNet.listen(1337,'10.8.0.1');

//Android connection 
var serverAndroid = net.createServer(function(s){

	console.log('Android connection - Server IP:6663');
	console.log('Connected: ' + s.remoteAddress + ':' + s.remotePort);
    sockets.push(s);

    s.write('Welcome to the server!\n');
    
 
    s.on('data', function(data) {
     
        if(data == 3) {
        	console.log('Android:close request');
			  socket.write(''+0);
			  socket.pipe(socket);
		

        }
        if(data == 2) {
        	console.log('Android:open request');
			  socket.write(''+1);
			  socket.pipe(socket);

        }
    });

    s.on('end', function() {
        console.log('Disconnected: ' + s.remoteAddress + ':' + s.remotePort);
        var index = sockets.indexOf(s);
        if (index != -1) {
            delete sockets[index];
        }
    });
});

serverAndroid.listen(6663, '10.8.0.1');

//Error handling used by all endpoints
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

//Returns a person with existing email
app.get('/returnUser/:email/:pass', function(req, res){
    var emailadd = req.params.email;
    var password = req.params.pass;
    db.persons.findOne({email: emailadd}, function(err, doc){
        bcrypt.hash(password, SALT, function(err, hash){
            if(doc != null && hash == doc.password1){
                res.json(doc);
            } else {
                res.json(null);
            }
        });

    });
});

app.get('/returnUser/:email', function(req, res){
    var emailadd = req.params.email;
    db.persons.findOne({email: emailadd}, function(err, doc){
        res.json(doc);
    });
});

//password registration 
app.post('/registration', function(req, res){
    console.log(req.body.email);
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(req.body.password1, SALT, function(err, hash){
            req.body.password1 = hash;
            db.persons.insert(req.body, function(err, doc){
               res.json(doc);
               console.log(req.body);
            });
        });
   });
});

//closing from remote
app.get('/close', function(req, res){
  console.log("Remote:Close request");
  socket.write(''+0);
  socket.pipe(socket);
});

//open gate from remote 
app.get('/open', function(req, res){
  console.log("Remote:Open request");
  socket.write(''+1);
  socket.pipe(socket);
});


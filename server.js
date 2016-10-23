var express = require("express");
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
var dev=0;

//Local connection 
var server = app.listen(process.env.PORT || 3030,function(){
  var port = server.address().port;
  console.log("Server running on port: " + port);
});

//web remote connection
var serverNet = net.createServer(function(socke) {

    socket=socke;
	socket.write(''+0);
	socket.pipe(socket);
 
  socket.on('data', function(data) {
     if (dev==0){}
     else{
        	console.log('ding dong '+data);
  			 // s.write(''+0);
  			 // s.pipe(socket);
          for (var devices=0;devices<dev;devices++)
  		    sockets[devices].write('There is someone at your gate\n');
              }
  });
        
});

serverNet.listen(1337, '10.8.0.1');

//Android connection 
var serverAndroid = net.createServer(function(s){

	console.log('Android connection - Server IP:6663');
	console.log('Connected: ' + s.remoteAddress + ':' + s.remotePort);
    sockets.push(s);
    sockets[dev]=s;
   
    var id=dev; 
    dev++;
    s.write('Welcome to the server!\n');
    
 
    s.on('data', function(data) {
        console.log('Data received');
        var temp=data.toString();
        console.log(data+" this is the input");
     
        if(data == 'b') {
        	console.log('Android:close request');
  			  socket.write(''+0);
  			  socket.pipe(socket);
  		    s.write('Gate is closed\n');
        }
        if(data == 'a') {
        	console.log('Android:open request');
  			  socket.write(''+1);
  			  socket.pipe(socket);
          s.write('Gate is open!\n');
        }
        
        if(data == 'd') {
        	console.log('Android: Appliance 1 off');
			    socket.write(''+3);
			    socket.pipe(socket);
//          s.write('Turning appliance on!\n');
        }
        if(data == 'c') {
        	console.log('Android: Appliance 1 on');
			    socket.write(''+2);
			    socket.pipe(socket);
    //      s.write('Turning appliance off!\n');
        }
        
        if(data == 'e') {
        	console.log('Android: Appliance 2 off');
			    socket.write(''+5);
			    socket.pipe(socket);
  //        s.write('Turning appliance on!\n');
        }
        if(data == 'f') {
        	console.log('Android: Appliance 2 on');
			    socket.write(''+4);
			    socket.pipe(socket);
      //    s.write('Turning appliance off!\n');
        }
        
        if(data == 'g') {
        	console.log('Android: Appliance 3 off');
			    socket.write(''+7);
			    socket.pipe(socket);
        //  s.write('Turning appliance on!\n');
        }
        if(data == 'h') {
        	console.log('Android: Appliance 3 on');
			    socket.write(''+6);
			    socket.pipe(socket);
          //s.write('Turning appliance off!\n');
        }
        
        if(data == 'i') {
        	console.log('Android: Appliance 4 off');
			    socket.write(''+9);
			    socket.pipe(socket);
         // s.write('Turning appliance on!\n');
        }
        if(data == 'j') {
        	console.log('Android: Appliance 4 on');
			    socket.write(''+8);
			    socket.pipe(socket);
          //s.write('Turning appliance off!\n');
        }
        
        // Appliances 5 to Appliance 8
        
        if(data == 'k') {
        	console.log('Android: Appliance 5 off');
			    socket.write(''+11);
			    socket.pipe(socket);
          //s.write('Turning appliance on!\n');
        }
        if(data == 'l') {
        	console.log('Android: Appliance 5 on');
			    socket.write(''+10);
			    socket.pipe(socket);
          //s.write('Turning appliance off!\n');
        }
        
        if(data == 'm') {
        	console.log('Android: Appliance 6 off');
			    socket.write(''+13);
			    socket.pipe(socket);
          //s.write('Turning appliance on!\n');
        }
        if(data == 'n') {
        	console.log('Android: Appliance 6 on');
			    socket.write(''+12);
			    socket.pipe(socket);
          //s.write('Turning appliance off!\n');
        }
        
        if(data == 'o') {
        	console.log('Android: Appliance 7 off');
			    socket.write(''+15);
			    socket.pipe(socket);
          //s.write('Turning appliance on!\n');
        }
        if(data == 'p') {
        	console.log('Android: Appliance 7 on');
			    socket.write(''+14);
			    socket.pipe(socket);
          //s.write('Turning appliance off!\n');
        }
        
        if(data == 'q') {
        	console.log('Android: Appliance 8 off');
			    socket.write(''+17);
			    socket.pipe(socket);
          //s.write('Turning appliance on!\n');
        }
        if(data == 'r') {
        	console.log('Android: Appliance 8 on');
			    socket.write(''+16);
			    socket.pipe(socket);
          //s.write('Turning appliance off!\n');
        }
    });

    s.on('end', function() {
        console.log('Disconnected: ' + s.remoteAddress + ':' + s.remotePort);
        for (var die=id;die<dev-1;die++){
          sockets[die]=sockets[die+1];
        }
        dev--;
        
        
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


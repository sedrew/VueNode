const express = require('express');
const app = express();
const jsonParser = require('express').json();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const child_process = require('child_process');
let logs = require('./modules/functions/logs');
let fan = require('./modules/functions/fan');
let fanInterval = setInterval(fan, 4000);
//LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
/////////

//Отправка заголовков для CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header(200);
	next();
});
/////////////////////
server.listen(8080);
logs('Сервер запущен!', 1);



app.use('/assets', express.static('./client/public'));
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
});


app.post('/delete',jsonParser,function(req,res){
	console.log(req.body);
	db.get('posts').remove({id:req.body.id}).write();
	res.sendStatus(200);
})
require('./modules/sockets')(io, fs, db, child_process, logs);
require('./modules/login')(app, jsonParser, db, crypto);
require('./modules/registration')(app, jsonParser, db, crypto, logs);
require('./modules/chat')(app, jsonParser, db, logs);
require('./modules/adminPanel')(app, jsonParser, fs, crypto, server, logs);

/////

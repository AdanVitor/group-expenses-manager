
const KEY = "ntalk.sid" , SECRET = "ntalk";
var express = require("express"), 
	load = require("express-load"), 
	bodyParser = require("body-parser"), 
	cookieParser = require("cookie-parser"), 
	expressSession = require("express-session"), 
	methodOverride = require("method-override"), 
	app = express(), 
	server = require("http").Server(app), 
	io = require('socket.io')(server), 
	cookie = cookieParser(SECRET), 
	store = new expressSession.MemoryStore(), 
	mongoose = require("mongoose");

	
global.db = mongoose.connect("mongodb://localhost/SpendManager");



app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
/*Esse cookie e o expressSession são pra usar a seção do Express no Socket.IO*/
app.use(cookie);
app.use(expressSession({
	secret: SECRET,
	name: KEY,
	resave: true,
	saveUninitialized: true,
	store: store
}));

app.use(cookieParser("ntalkVersao02"));
app.use(expressSession());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));


io.use(function(socket, next) {
	var data = socket.request; /*socket.request - contém as informações do request do cliente.*/
	cookie(data, {}, function(err) {
		var sessionID = data.signedCookies[KEY];
		/*Essa função store busca os dados da sessão que estão na memória do servidor.*/
		store.get(sessionID, function(err, session) {
			if (err || !session) {
				return next(new Error("acesso negado"));
			} else {
				/* incluimos essa seção no socket.handshake.sesson */
				socket.handshake.session = session;
				return next();
			}
		});
	});
});

io.app = app;

load("models")
	.then("controllers")
	.then("routes")
	.into(app)
;
/*Aqui tô incluindo os sockets no app.js*/
load("sockets").into(io);


server.listen(3000, function(){
	console.log("Expenses manager online!");
});

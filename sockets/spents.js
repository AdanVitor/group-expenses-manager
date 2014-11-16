/* essa função io.sockets.on("connection") fica aguardando que 
o cliente envie uma mensagem para o servidor - único evento ainda send-server.
Fluxo básico - cliente envia uma mensagem para o servidor e o servidor responde 
o próprio clinte, via client.emit ou a todos os clientes via client.broadcast.emit*/
module.exports = function(io) {
		var crypto = require("crypto") ,sockets = io.sockets;
		var count = 0 ;

		sockets.on("connection", function (client) {

			var session = client.handshake.session
			,usuario = session.usuario;

			client.on("send-server", function (msg) {
				var sala = session.sala;
				sockets.in(sala).emit("send-client", msg + " " + count);
				count++;
			});

			client.on("join", function(sala) {
				session.sala = sala;
				console.log("join: " + sala);
				client.join(sala);
			});

			client.on("disconnect", function () {
				client.leave(session.sala);
			});

		});
}
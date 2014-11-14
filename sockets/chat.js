/* essa função io.sockets.on("connection") fica aguardando que 
o cliente envie uma mensagem para o servidor - único evento ainda send-server.
Fluxo básico - cliente enviar uma mensagem para o servidor e o servidor responde 
o próprio clinte, via client.emit ou a todos os clientes via client.broadcast.emit*/
module.exports = function(io) {
		var crypto = require("crypto") /* esse módulo crypto vai gerar o hash da sala */
		,sockets = io.sockets
		;
		sockets.on("connection", function (client) {

			var session = client.handshake.session
			, user = session.user;


			client.on("send-server", function (msg) {
				var sala = session.sala
				, data = {email: user.email, sala: sala};
				msg = "<b>"+user.name+":</b> "+msg+"<br>";
				client.broadcast.emit("new-message", data);
				/*Essa função será importante para o projeto - o group nada mais é do que uma sala,
				mas na qual o cliente não se desconecta quando sai da sala*/
				sockets.in(sala).emit("send-client", msg);
			});


			/*Esse evento será emitido quando o cliente entrar
			na sala de chat*/
			client.on("join", function(sala) {
				if(!sala) {
					var timestamp = new Date().toString()
					, md5 = crypto.createHash("md5");
					sala = md5.update(timestamp).digest("hex");
				}
				session.sala = sala;
				client.join(sala);
			});

			/*excluir um usuário da sala quando o mesmo se desconectar*/
			client.on("disconnect", function () {
				client.leave(session.sala);
			});

	});
}
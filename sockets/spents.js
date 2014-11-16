/* essa função io.sockets.on("connection") fica aguardando que 
o cliente envie uma mensagem para o servidor - único evento ainda send-server.
Fluxo básico - cliente envia uma mensagem para o servidor e o servidor responde 
o próprio clinte, via client.emit ou a todos os clientes via client.broadcast.emit*/
module.exports = function(io) {
		
		var crypto = require("crypto") ,sockets = io.sockets;
		var User = io.app.models.user;
		var Expense = io.app.models.expense;
		var Group = io.app.models.group;
		var expensesQueue = [];
		var count = 0 ;

		sockets.on("connection", function (client) {

			var session = client.handshake.session
			,usuario = session.usuario;

			client.on("send-server", function (expenseData , groupID) {
				var user_id = expenseData.userID;
				// finishing of to mount the expenseData object adding the name of the user
				User.findById(user_id , function (error, user){
					expenseData.userName = user.name;
					Expense.create(expenseData , function (error, expense){
						var socketGroup = session.socketGroup;
						Group.findById(groupID, function (error,group){
							var balance = group.usersBalance;
							var newCost = parseFloat(expenseData.cost);
							var delta = newCost/group.userIDs.length;
							for(var x in balance){
								if(balance[x].userID == user_id){
									balance[x].balance += delta;
								}
								else{
									balance[x].balance -= delta;
								}
							}
							group.save();
							sockets.in(socketGroup).emit("send-client", expense);
						});
						
					});
				});
				
			});

			client.on("join", function(socketGroup) {
				session.socketGroup = socketGroup;
				console.log("join: " + socketGroup);
				client.join(socketGroup);
			});

			client.on("disconnect", function () {
				client.leave(session.group);
			});

		});
}
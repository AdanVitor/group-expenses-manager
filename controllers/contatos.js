module.exports = function(app) {
	var Usuario = app.models.usuario;
	var ContatosController = {
		index: function(req, res) {
			var _id = req.session.usuario._id; /*Lembrando que o usuário, recuperado do banco de dados, agora tem um id*/
			Usuario.findById(_id, function(erro, usuario) {
				var contatos =  usuario.contatos;
				var resultado = { contatos: contatos };
				res.render("contatos/index", resultado);
			});
		},
		create: function(req, res) {
			var _id = req.session.usuario._id;
			var client;

			Usuario.findById(_id, function(erro, usuario) {
				var contato = req.body.contato;
				var contatos = usuario.contatos;
				contatos.push(contato);
				usuario.save();
				client = usuario.toJSON();
				console.log("cliente: " + client);

				/*criando o contato a ser adicionado em B*/
				var contact = {};
				contact.nome = client.nome;
				contact.email = client.email;
				/*anteriormente adicionou-se o contato B para o usuário A
				agora adicioando A como contato do usuário do B - relação
				reflexiva*/
				var query = {email: req.body.contato.email};
				Usuario.findOne(query).select().exec(function(erro,userB){
					if(userB){
						console.log("userB:" + userB);
						var contatos = userB.contatos;
						contatos.push(contact);
						userB.save(function(){
							res.redirect("/contatos");
						});
						
					}
					else{
						console.log("Usuario nao existente");
					}

				});

			});

			



		},
		show: function(req, res) {
			var _id = req.session.usuario._id;
			Usuario.findById(_id, function(erro, usuario) {
				var contatoID = req.params.id;
				var contato = usuario.contatos.id(contatoID);
				var resultado = { contato: contato };
				res.render("contatos/show", resultado);
			});
		},
		edit: function(req, res) {
			var _id = req.session.usuario._id;
			Usuario.findById(_id, function(erro, usuario) {
				var contatoID = req.params.id;
				var contato = usuario.contatos.id(contatoID);
				var resultado = { contato: contato };
				res.render("contatos/edit", resultado);
			});
		},

		update: function(req, res) {
		var _id = req.session.usuario._id;
			Usuario.findById(_id, function(erro, usuario) {
				var contatoID = req.params.id;
				var contato = usuario.contatos.id(contatoID);
				contato.nome = req.body.contato.nome;
				contato.email = req.body.contato.email;
				/*Função save pra atualizar o usuário no banco de dados*/
				usuario.save(function() {
					res.redirect("/contatos");
				});
			});
		},
		destroy: function(req, res) {
		var _id = req.session.usuario._id;
		Usuario.findById(_id, function(erro, usuario) {
			var contatoID = req.params.id;
			usuario.contatos.id(contatoID).remove();
			usuario.save(function() {
			res.redirect("/contatos");
			});
		});
	}
		
	};
	return ContatosController;
};
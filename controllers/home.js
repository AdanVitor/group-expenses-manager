module.exports = function(app) {
	var Usuario = app.models.usuario;

	var HomeController = {
		index: function(req, res) {
			res.render("home/index");
		},
		login: function(req, res) {
			var query = {email: req.body.usuario.email};
			Usuario.findOne(query).select("nome email").exec(function(erro, usuario){
				if (usuario) {
					req.session.usuario = usuario; /*Como esse usuário tá vindo do banco do dados - 
					ele já tá vindo com um id, criado pelo db.*/
					res.redirect("/contatos");
				} 
				else { /*No caso de ser um novo usuário.*/
					var usuario = req.body.usuario;
					Usuario.create(usuario, function(erro, usuario){
						if(erro){
								res.redirect("/");
						} else {
							req.session.usuario = usuario;
							res.redirect("/contatos");
						}
					});
				}
			});
		},
		logout:function (req,res){
			req.session.destroy();
			res.redirect("/");
		}
	};
	return HomeController;
};
module.exports = function(app) {
	var User = app.models.user;
	var HomeController = {
		index: function(req, res) {
			res.render("home/index");
		},
		login: function(req, res) {
			var query = {email: req.body.user.email};
			User.findOne(query).select("name email").exec(function(erro, user){
				console.log(user);
				console.log(typeof user._id);
				if (user) {
					req.session.user = user; 
					res.redirect("/groups");
				} 
				else { /*No caso de ser um novo usuário.*/
					var user = req.body.user;
					User.create(user, function(erro, user){
						if(erro){
								res.redirect("/");
						} else {
							req.session.user = user;
							res.redirect("/groups");
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
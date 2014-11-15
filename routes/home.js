module.exports = function(app) {
	/*Por causa  do express-loader o app tem um subobjeto chamado controllers*/
	var home = app.controllers.home;
	app.get("/", home.index);
	app.post("/entrar", home.login);
	app.get("/sair", home.logout);
};

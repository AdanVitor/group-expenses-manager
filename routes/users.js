module.exports = function(app) {
    var users = app.controllers.users;
    var autenticar = require("./../middlewares/autenticador");
	app.get("/show_contact", autenticar, users.show_contact);
    app.post("/add_contact", autenticar, users.add_contact);
 };
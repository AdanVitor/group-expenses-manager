module.exports = function(app) {
	var groups = app.controllers.groups
	,autenticar = require("./../middlewares/autenticador");
	app.get("/groups", autenticar, groups.index);
	app.get("/create_group",autenticar,groups.create_group);
	app.post("/save_group",autenticar,groups.save_group);
	app.get("/contact/:id", autenticar, groups.show);
	app.post("/group", autenticar, groups.create);
	app.get("/contact/:id/editar", autenticar, groups.edit);
	app.put("/contact/:id", autenticar, groups.update);
	app.delete("/contact/:id", autenticar, groups.destroy);
	app.get("/test", autenticar, groups.get_group);
};

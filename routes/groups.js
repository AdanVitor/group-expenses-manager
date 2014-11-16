module.exports = function(app) {
    var groups = app.controllers.groups;
    var users = app.controllers.users;
    var autenticar = require("./../middlewares/autenticador");
    app.get("/groups", autenticar, groups.index);
    app.get("/create_group",autenticar,groups.create_group);
    app.post("/save_group",autenticar,groups.save_group);
    app.get("/test", autenticar, groups.get_group);
    app.get("/edit_group/:id", autenticar, groups.edit_group);
    app.post("/edit_group/:id", autenticar, groups.save_edit_group);
    app.get("/add_group_member/:id", autenticar, groups.add_group_member);
    app.post("/add_group_member", autenticar, groups.save_group_member);
    app.get("/view_group/:id", autenticar, groups.view_group);
};

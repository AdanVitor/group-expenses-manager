module.exports = function(app) {
	var User = app.models.user;
	var Group = app.models.group;
	var GroupsController = {
		index: function(req, res) {
			var _id = req.session.user._id; 
			console.log(typeof _id);
			User.findById(_id, function(erro, user) {
				var contacts =  user.contacts;
				var groupIDs = user.groupIDs;
				console.log(groupIDs);
				// acha todos os elementos em 'groupIDs' e retorna um array
				Group.find( { '_id': { $in: groupIDs} }, function(erro, matching_groups){
					console.log("grupos");
					console.log(matching_groups);
					var resultado = { contacts: contacts , user: req.session.user, groups: matching_groups};
					res.render("groups/index", resultado);
				});
			});
		},
		create_group: function(req, res) {
			/*recuperando os contacts desse cliente no banco de dados*/
			var _id = req.session.user._id; /*Lembrando que o usuário, recuperado do banco de dados, agora tem um id*/
			User.findById(_id, function(erro, user) {
				var resultado = { user: req.session.user};
				res.render("groups/create_group", resultado);
			});
		},
		save_group: function(req, res) {
			var _id = req.session.user._id;
			var newGroup = req.body.group;
			Group.create(newGroup,function (erro,group){
				if(group){
					var userIds = group.userIDs;
					userIds.push(_id);
					group.save();
					/*Adding the idGroup in the user*/
					User.findById(_id, function(erro,user){
						var groupIDs = user.groupIDs;
						groupIDs.push(group._id);
						user.save();
						console.log("user");
						console.log(user);
					});
					res.redirect("/groups");
				}else{
					console.log("erro ao criar grupo");
				}

			});
		},
		get_group: function(req, res) {
			var _id = req.session.user._id;
			User.findById(_id, function(erro, user) {
				res.json(user.contacts);
			});
		},
        edit_group: function (req, res) {
            var id = req.params.id;
            Group.findById(id, function(error, group) {
                console.log("edit_group: the group is " + group);
                res.render("groups/edit_group", {group: group});
            });
        },
        save_edit_group: function (req, res) {
            var id = req.params.id;
            var newGroup = req.body.group;
            Group.findById(id, function(error, group) {
                console.log("edit_group: old group is " + group);
                group.name = newGroup.name;
                group.description = newGroup.description;
                group.save()
                console.log("edit_group: new group is " + group);
                res.redirect("/groups");
            });
        },
        add_member: function  (req,res) {
        	var id = req.params.id;
        	Group.findById(id, function(error, group) {
                console.log("addMember: the group is " + group);
                res.render("groups/add_member", {group: group});
            });
        }
	};
	return GroupsController;
};

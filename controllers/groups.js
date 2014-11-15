module.exports = function(app) {
	var User = app.models.user;
	var Group = app.models.group;
	var GroupsController = {
		index: function(req, res) {
			var userID = req.session.user._id; 
			console.log(typeof userID);
			User.findById(userID, function(erro, user) {
				var contacts =  user.contacts;
				var groupIDs = user.groupIDs;
				console.log("groupsIDs\n");
				console.log(groupIDs);
				// acha todos os elementos em 'groupIDs' e retorna um array
				Group.find({'_id': { $in: groupIDs} }, function(erro, matching_groups){
					if(matching_groups){
						console.log("grupos");
						console.log(matching_groups);
						User.find({ '_id': { $in: contacts} },function  (erro,contactsList) {
							var resultado = { contacts: contactsList , user: req.session.user, groups: matching_groups};
							res.render("groups/index", resultado);
						});
					}
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
                var userIDs = group.userIDs;
                User.find( { '_id': { $in: userIDs} }, function(erro, members){
                	res.render("groups/edit_group", {group: group, members:members});
                });	
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
        add_group_member: function  (req,res) {
        	var groupId = req.params.id;
        	var id = req.session.user._id;
			User.findById(id , function (erro,user){
				if(user){
					var contacts = user.contacts;
					var possibleMembers = [];
					Group.findById(groupId , function (error, group){
						var userIDs = group.userIDs;
						for (var i = 0 ; i < contacts.length;i++){
							var found = false;
							for(var j = 0 ; j < userIDs.length;j++){
								if(userIDs[j]==contacts[i]){
									found = true;
									break;
								}
							}
							if(!found){
								possibleMembers.push(contacts[i]);
							}
						}
						User.find({'_id': {$in: possibleMembers} }, function (error,contactsList){
							res.render("groups/add_member",{contacts: contactsList,
								groupId: groupId});
						});	

					});
				}
			});
        },
        save_group_member: function  (req,res) {
        	var groupID = req.body.group.id;
        	var contactID = req.body.contact.id;
			User.findById(contactID , function (erro,contact){
				if(contact){
					var groupIDs = contact.groupIDs;
					groupIDs.push(groupID);
					contact.save();
					Group.findById(groupID , function (erro,group){
						if(group){
							var userIDs = group.userIDs;
							userIDs.push(contactID);
							group.save();
							res.redirect("/groups");
						}
					});
				}
			});
        }

	};
	return GroupsController;
};
